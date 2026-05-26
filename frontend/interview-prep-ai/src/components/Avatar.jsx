import React from 'react'

const sizeConfig = {
  sm: {
    container: 'w-8 h-8 text-sm',
    image: 'w-8 h-8',
  },
  md: {
    container: 'w-11 h-11 text-base',
    image: 'w-11 h-11',
  },
  lg: {
    container: 'w-14 h-14 text-xl',
    image: 'w-14 h-14',
  },
}

const pastelGradients = [
  'from-[#E6F4FF] via-[#DCEBFF] to-[#C9E0FF]',
  'from-[#FFF4E6] via-[#FFE8CF] to-[#FFDCB7]',
  'from-[#EAF8F1] via-[#DDF0E5] to-[#D0E9D9]',
  'from-[#F7E8FF] via-[#EDD9FF] to-[#E1C9FF]',
  'from-[#FEEFF1] via-[#FDD8DD] to-[#FDC0C9]',
  'from-[#E8F1FF] via-[#D8E2FF] to-[#C7D3FF]',
]

const getInitials = (name) => {
  if (!name) return ''
  const parts = name
    .trim()
    .split(' ')
    .filter(Boolean)

  if (!parts.length) return ''

  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }

  const firstInitial = parts[0][0]
  const lastInitial = parts[parts.length - 1][0]
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

const getGradient = (name) => {
  if (!name) return pastelGradients[0]
  const hash = Array.from(name.toLowerCase()).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return pastelGradients[hash % pastelGradients.length]
}

const Avatar = ({ name = '', image = '', size = 'md', className = '' }) => {
  const initials = getInitials(name)
  const gradient = getGradient(name)
  const config = sizeConfig[size] || sizeConfig.md
  const hasImage = typeof image === 'string' && image.trim().length > 0

  return hasImage ? (
    <img
      src={image}
      alt={name || 'Avatar'}
      className={`rounded-full object-cover ${config.image} ${className} transition-transform duration-200 ease-in-out hover:scale-105 shadow-sm`}
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center ${config.container} bg-linear-to-br ${gradient} text-white font-semibold ${className} transition-transform duration-200 ease-in-out hover:scale-105 shadow-sm`}
    >
      {initials || 'U'}
    </div>
  )
}

export default Avatar
