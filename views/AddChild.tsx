
import React, { useState, useRef } from 'react';
import { FamilyMember, FamilyRole } from '../types';
import { supabase } from '../lib/supabase';

interface AddChildProps {
  memberToEdit?: FamilyMember;
  onSave: (member: FamilyMember) => void;
  onCancel: () => void;
  userId?: string;
}

const AddChild: React.FC<AddChildProps> = ({ memberToEdit, onSave, onCancel, userId }) => {
  const [formData, setFormData] = useState({
    name: memberToEdit?.name || '',
    role: memberToEdit?.role || 'Hijo/a' as FamilyRole,
    age: memberToEdit?.age || '',
    dob: memberToEdit?.vitals?.dob || '',
    sex: memberToEdit?.vitals?.sex || 'Male',
    bloodGroup: memberToEdit?.vitals?.bloodGroup || 'O+',
    weight: memberToEdit?.vitals?.weight?.replace('kg', '') || '',
    height: memberToEdit?.vitals?.height?.replace('cm', '') || '',
    birthWeight: memberToEdit?.vitals?.birthWeight || '',
    birthHeight: memberToEdit?.vitals?.birthHeight || '',
    birthCity: memberToEdit?.vitals?.birthCity || '',
    birthCountry: memberToEdit?.vitals?.birthCountry || '',
    avatar: memberToEdit?.avatar || '',
    email: memberToEdit?.email || ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `member_${Date.now()}.${fileExt}`;

      // Validate file type
      if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '')) {
        alert('Formato no soportado. Usa JPG, PNG o GIF.');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 2MB.');
        return;
      }

      setIsUploading(true);

      // 1. Upload to Supabase Storage
      // Use userId to organize files and satisfy RLS policies (restricted to user's folder)
      // If userId is missing (shouldn't happen in auth'd context), fall back to public 'members' folder but warn
      const basePath = userId ? userId : 'anonymous';
      const filePath = `${basePath}/${fileName}`;

      console.log('Uploading avatar to:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (data) {
        setFormData(prev => ({ ...prev, avatar: data.publicUrl }));
      }

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert('Error al subir la imagen: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the upload click
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar la foto?');
    if (confirmDelete) {
      setFormData(prev => ({ ...prev, avatar: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let ageValue = formData.age;
    if (!ageValue && formData.dob) {
      ageValue = 'Nuevo';
    } else if (!ageValue) {
      ageValue = 'N/A';
    }

    // For new members, don't set id - let Supabase generate UUID
    // For edits, preserve the existing id
    const newMember: FamilyMember = {
      ...(memberToEdit?.id ? { id: memberToEdit.id } : {}),
      name: formData.name,
      role: formData.role,
      age: ageValue,
      status: memberToEdit?.status || '✨ Recién Agregado',
      avatar: formData.avatar,
      email: formData.role !== 'Hijo/a' ? formData.email : undefined,
      vitals: {
        weight: formData.weight ? formData.weight + 'kg' : undefined,
        height: formData.height ? formData.height + 'cm' : undefined,
        bloodGroup: formData.bloodGroup,
        dob: formData.dob,
        sex: formData.sex,
        // Preserve birth data only on first save; on edit, use what's already saved
        birthWeight: memberToEdit ? memberToEdit.vitals?.birthWeight : formData.birthWeight,
        birthHeight: memberToEdit ? memberToEdit.vitals?.birthHeight : formData.birthHeight,
        birthCity: memberToEdit ? memberToEdit.vitals?.birthCity : formData.birthCity,
        birthCountry: memberToEdit ? memberToEdit.vitals?.birthCountry : formData.birthCountry
      }
    } as FamilyMember;
    onSave(newMember);
  };

  // Filter roles: If adding new (no memberToEdit), only allow 'Hijo/a'. If editing, allow all (to preserve existing data or fix mistakes)
  const availableRoles: FamilyRole[] = memberToEdit ? ['Hijo/a', 'Padre/Madre', 'Abuelo/a', 'Tío/a', 'Primo/a', 'Cuidador/a'] : ['Hijo/a'];

  return (
    <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[800px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-[#678380] hover:text-primary transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#121716] dark:text-white tracking-tight">
            {memberToEdit ? 'Editar Familiar' : 'Agregar Hijo/a'}
          </h1>
          <p className="text-[#678380] dark:text-gray-400 mt-1">
            {memberToEdit ? 'Actualiza los datos de este miembro.' : 'Registra un nuevo hijo/a a tu familia.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">

        <div className="flex flex-col items-center mb-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            {formData.avatar ? (
              <>
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 object-cover shadow-md group-hover:brightness-75 transition-all"
                />
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-20"
                  title="Eliminar foto"
                >
                  <span className="material-symbols-outlined text-sm block">close</span>
                </button>
              </>
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-md group-hover:brightness-90 transition-all">
                <span className="material-symbols-outlined text-4xl text-gray-400">add_a_photo</span>
              </div>
            )}

            <button type="button" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`material-symbols-outlined text-white ${isUploading ? 'animate-spin' : ''}`}>
                {isUploading ? 'refresh' : 'photo_camera'}
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/*"
            />
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
            {isUploading ? 'Subiendo...' : 'Tocá para cambiar foto'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          {memberToEdit && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parentesco / Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all font-bold text-primary"
              >
                {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sexo</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha de Nacimiento</label>
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split('T')[0] : ''}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {formData.role !== 'Hijo/a' && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico (para vincular cuenta)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
              />
              <p className="text-[10px] text-gray-400">
                <span className="material-symbols-outlined text-[10px] align-middle mr-1">info</span>
                Si este familiar ya tiene cuenta, se vinculará automáticamente.
              </p>
            </div>
          )}

          {formData.role === 'Hijo/a' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Peso Actual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Ej. 3.5"
                  className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Talla Actual (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Ej. 50"
                  className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Only show birth details section when ADDING new (not editing) */}
              {!memberToEdit && (
                <>
                  <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-[#121716] dark:text-white flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-lg">auto_stories</span>
                      Detalles para "Mi Historia"
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Completa estos datos para generar la historia de nacimiento.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Peso al Nacer (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="birthWeight"
                      value={formData.birthWeight}
                      onChange={handleChange}
                      placeholder="Ej. 3.2"
                      className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Talla al Nacer (cm)</label>
                    <input
                      type="number"
                      name="birthHeight"
                      value={formData.birthHeight}
                      onChange={handleChange}
                      placeholder="Ej. 48"
                      className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ciudad de Nacimiento</label>
                    <input
                      type="text"
                      name="birthCity"
                      value={formData.birthCity}
                      onChange={handleChange}
                      placeholder="Ej. Madrid"
                      className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">País de Nacimiento</label>
                    <input
                      type="text"
                      name="birthCountry"
                      value={formData.birthCountry}
                      onChange={handleChange}
                      placeholder="Ej. España"
                      className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grupo Sanguíneo</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
            >
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-bold text-[#678380] hover:text-[#121716] dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            {memberToEdit ? 'Guardar Cambios' : 'Guardar Miembro'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddChild;
