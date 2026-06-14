/**
 * Staff creation from templates
 * POST /api/pos/staff-templates
 *
 * Creates a staff member with permissions from a selected template
 */

import { createClient } from '@/lib/supabase/server'
import {
  getTemplateById,
  type StaffTemplateType,
} from '@/lib/staff-templates'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      templateId,
      businessType,
      location_id,
      pin,
      sector,
    } = body

    // Validate required fields
    if (!name || !templateId || !businessType) {
      return NextResponse.json(
        {
          error: 'Missing required fields: name, templateId, businessType',
        },
        { status: 400 }
      )
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      )
    }

    // Get template
    const template = getTemplateById(
      templateId,
      businessType as StaffTemplateType
    )
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check seat limit if using superbase
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Create auth user if email provided
    let authUserId = user.id
    if (email) {
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email,
        password: crypto.getRandomValues(new Uint8Array(32)).toString(),
        email_confirm: true,
      })

      if (createUserError) {
        // Email might already exist, that's okay
        if (!createUserError.message.includes('already')) {
          return NextResponse.json(
            { error: createUserError.message },
            { status: 400 }
          )
        }
      } else if (newUser) {
        authUserId = newUser.user.id
      }
    }

    // Create staff record with template permissions
    const { data: staffData, error: staffError } = await supabase
      .from('pos_staff')
      .insert({
        owner_id: user.id,
        name,
        email: email || null,
        phone: phone || null,
        role: template.id, // Use template ID as role reference
        active: true,
        location_id: location_id || null,
        sector: sector || 'retail',
        metadata: {
          template_id: templateId,
          template_name: template.name,
          permissions: template.defaultPermissions,
          responsibilities: template.responsibilities,
          icon: template.icon,
          color: template.color,
          pin: pin ? parseInt(pin) : null,
        },
      })
      .select()
      .single()

    if (staffError) {
      return NextResponse.json(
        { error: staffError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      staff: {
        id: staffData.id,
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role,
        active: staffData.active,
        location_id: staffData.location_id,
        permissions: template.defaultPermissions,
        template: {
          id: templateId,
          name: template.name,
          icon: template.icon,
          permissions: template.defaultPermissions,
        },
      },
    })
  } catch (error: any) {
    console.error('Error creating staff from template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create staff' },
      { status: 500 }
    )
  }
}
