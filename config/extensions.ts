/**
 * 🧩 REGISTRO MAESTRO DE EXTENSIONES - DACRIBEL
 * 
 * Este archivo es el "Enchufe Central" de la aplicación.
 * Cualquier módulo nuevo debe registrarse aquí para ser detectado por la UI.
 */

export interface ExtensionModule {
  id: string;               // ID único del módulo (ej: 'psn-promos')
  name: string;             // Nombre visible
  description: string;      // Breve descripción
  icon: string;             // Nombre del icono (Lucide React)
  route: string;            // Ruta relativa (ej: '/extensions/psn-promos')
  enabled: boolean;         // Interruptor maestro
  status: 'beta' | 'stable' | 'maintenance';
  config?: Record<string, any>; // Configuraciones específicas del módulo
}

// Lista de extensiones configuradas
export const REGISTERED_EXTENSIONS: ExtensionModule[] = [
  /* 
  Ejemplo de configuración:
  {
    id: 'psn-promos',
    name: 'PlayStation Promos',
    description: 'Catálogo de ofertas exclusivas de PSN Store',
    icon: 'Gamepad2',
    route: '/extensions/psn-promos',
    enabled: false, // Desactivado por defecto hasta que exista el código
    status: 'beta'
  }
  */
];

/**
 * Función helper para filtrar solo los módulos activos
 */
export const getActiveExtensions = () => {
  return REGISTERED_EXTENSIONS.filter(ext => ext.enabled);
};
