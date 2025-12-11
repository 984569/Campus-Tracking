'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Simulación de delay para efecto visual
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === 'shelly.vasquez@rockwellautomation.com' && password === 'Yohagoquefuncione*') {
        cookies().set('session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        return { success: true }
    }

    return { error: 'Credenciales inválidas' }
}

export async function logout() {
    cookies().delete('session')
    redirect('/login')
}
