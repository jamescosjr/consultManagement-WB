import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import api from '../services/api'

export default function SearchableSelect({ 
  type = 'doctors', // 'doctors' or 'patients'
  value, 
  onChange, 
  label = 'Select'
}) {
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (value) {
      const item = options.find(opt => opt._id === value)
      setSelectedItem(item || null)
    }
  }, [value, options])

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)
      try {
        const endpoint = search.trim() 
          ? `/${type}/name/${encodeURIComponent(search.trim())}` 
          : `/${type}`
        const res = await api.get(endpoint)
        setOptions(res.data)
      } catch (err) {
        console.error(`Erro ao buscar ${type}:`, err)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchOptions, 300)
    return () => clearTimeout(debounceTimer)
  }, [search, type])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    setSelectedItem(item)
    onChange(item._id)
    setSearch('')
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedItem(null)
    onChange(null)
    setSearch('')
  }

  const displayName = selectedItem 
    ? (type === 'doctors' ? selectedItem.specialty ? `${selectedItem.name} (${selectedItem.specialty})` : selectedItem.name : selectedItem.name)
    : ''

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400 block mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-3 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder={displayName || 'Buscar...'}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="input-field pl-9 pr-9"
        />
        {selectedItem && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-slate-200 rounded-lg bg-white shadow-lg z-50">
          {loading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Carregando...</div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400">Nenhum resultado encontrado</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <li key={option._id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{option.name}</div>
                      {type === 'doctors' && option.specialty && (
                        <div className="text-xs text-slate-500">{option.specialty}</div>
                      )}
                      {type === 'patients' && option.age && (
                        <div className="text-xs text-slate-500">{option.age} anos</div>
                      )}
                    </div>
                    {selectedItem?._id === option._id && (
                      <span className="text-indigo-600 font-semibold">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
