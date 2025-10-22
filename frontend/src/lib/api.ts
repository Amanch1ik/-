import axios from 'axios'

export const api = axios.create({ baseURL: '/' })

export async function requestOtp(phone: string) {
  await api.post('/api/v1/auth/request-otp', { phone })
}

export async function verifyOtp(phone: string, code: string) {
  const { data } = await api.post('/api/v1/auth/verify', { phone, code })
  return data as { access_token: string; token_type: string }
}

export type Partner = {
  id: number
  name: string
  branches: number
  nearest_km: number
  is_favorite: boolean
}

export type PartnerDetail = {
  id: number
  name: string
  branches: number
  nearest_km: number
  phone: string | null
  website: string | null
  description: string | null
  rating: number
  is_favorite: boolean
}

export type Review = {
  id: number
  partner_id: number
  author: string
  rating: number
  text: string
  created_at: string
}

export async function listPartners(q?: string) {
  const { data } = await api.get('/api/v1/partners', { params: { q } })
  return data as Partner[]
}

export async function getPartner(id: number) {
  const { data } = await api.get(`/api/v1/partners/${id}`)
  return data as PartnerDetail
}

export async function getPartnerReviews(id: number) {
  const { data } = await api.get(`/api/v1/partners/${id}/reviews`)
  return data as Review[]
}

export async function toggleFavorite(id: number) {
  const { data } = await api.post(`/api/v1/partners/${id}/favorite`)
  return data as { favorite: boolean }
}


