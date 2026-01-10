
import React, { useState } from 'react';
import { FamilyMember, FamilyRole } from '../types';

interface AddChildProps {
  memberToEdit?: FamilyMember;
  onSave: (member: FamilyMember) => void;
  onCancel: () => void;
}

const AddChild: React.FC<AddChildProps> = ({ memberToEdit, onSave, onCancel }) => {
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
    avatar: memberToEdit?.avatar || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=200&h=200&auto=format&fit=crop',
    email: memberToEdit?.email || ''
  });

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

    const newMember: FamilyMember = {
      id: memberToEdit?.id || Date.now().toString(),
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
        birthWeight: formData.birthWeight,
        birthHeight: formData.birthHeight,
        birthCity: formData.birthCity,
        birthCountry: formData.birthCountry
      }
    };
    onSave(newMember);
  };

  const roles: FamilyRole[] = ['Hijo/a', 'Padre/Madre', 'Abuelo/a', 'Tío/a', 'Primo/a', 'Cuidador/a'];

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
            {memberToEdit ? 'Editar Familiar' : 'Agregar Miembro Familiar'}
          </h1>
          <p className="text-[#678380] dark:text-gray-400 mt-1">
            {memberToEdit ? 'Actualiza los datos de este miembro.' : 'Registra a un nuevo integrante de tu círculo familiar.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
        <div className="flex flex-col items-center mb-4">
          <div className="relative group">
            <img
              src={formData.avatar}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 object-cover shadow-md group-hover:brightness-75 transition-all"
            />
            <button type="button" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </button>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Foto de Perfil</p>
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
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parentesco / Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all font-bold text-primary"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edad o Etapa</label>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Ej. 30 años o 5 meses"
              className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Peso (kg)</label>
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Talla (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Ej. 50"
                  className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
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
