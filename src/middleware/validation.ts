import { body } from 'express-validator';

export const validateAppointmentStatus = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del estado de la cita es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del estado de la cita debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateAppointmentStatusUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del estado de la cita debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validatePaymentMethods = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del método es requerido')
    .isLength({ min: 2, max:100 })
    .withMessage('El nombre del estado de la cita debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
]

export const validatePaymentMethodsUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del estado de la cita debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateRole = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del rol es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del rol debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateRoleUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del rol debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateBranche = [
  body('id_company')
    .notEmpty()
    .withMessage('El ID de la compania es requerido')
    .isInt()
    .withMessage('El ID de la compania debe ser un número entero'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la sucursal no puede estar vacio')
    .isLength({ min: 12, max: 50})
    .withMessage('El nombre de la sucursal debe tener entre 12 y 50 caracteres'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El numero de celular no puede estar vacio')
    .isLength({ min:10, max:10 })
    .withMessage('El celular debe contener 10 digitos'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('La dirección de la sucursal no puede estar vacio')
    .isLength({ min: 15, max: 250})
    .withMessage('La dirección de la sucursal debe tener entre 15 y 250 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo de la sucursal no puede estar vacio')
    .isLength({ min: 15, max: 250})
    .withMessage('El correo de la sucursal debe tener entre 15 y 250 caracteres'),

  body('id_province')
    .notEmpty()
    .withMessage('El ID de la provincia es requerido')
    .isInt()
    .withMessage('El ID de la provincia debe ser un número entero'),

  body('id_canton')
    .notEmpty()
    .withMessage('El ID del cantón es requerido')
    .isInt()
    .withMessage('El ID del cantón debe ser un número entero'),
]
export const validateProvince = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la provincia es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la provincia debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateBrancheUpdate = [
  body('id_company')
    .optional()
    .isInt()
    .withMessage('El ID de la compania debe ser un número entero'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 12, max: 50})
    .withMessage('El nombre de la sucursal debe tener entre 12 y 50 caracteres'),

  body('phone')
    .optional()
    .trim()
    .isLength({ min:10, max:10 })
    .withMessage('El celular debe contener 10 digitos'),

  body('address')
    .optional()
    .trim()
    .isLength({ min: 15, max: 250})
    .withMessage('La dirección de la sucursal debe tener entre 15 y 250 caracteres'),

  body('email')
    .optional()
    .trim()
    .isLength({ min: 15, max: 250})
    .withMessage('El correo de la sucursal debe tener entre 15 y 250 caracteres'),

  body('id_manager')
    .optional()
    .isInt()
    .withMessage('El ID del gerente debe ser un número entero'),
]
export const validateProvinceUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la provincia debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateCanton = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del cantón es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del cantón debe tener entre 2 y 100 caracteres'),

  body('id_province')
    .notEmpty()
    .withMessage('El ID de la provincia es requerido')
    .isInt()
    .withMessage('El ID de la provincia debe ser un número entero'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateCantonUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del cantón debe tener entre 2 y 100 caracteres'),

  body('id_province')
    .optional()
    .isInt()
    .withMessage('El ID de la provincia debe ser un número entero'),

  body('id_canton')
    .optional()
    .isInt()
    .withMessage('El ID del cantón debe ser un número entero'),

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateItems = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 5, max: 50 })
    .withMessage('El nombre del item debe tener entre 5 y 50 caracteres'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 250 })
    .withMessage('La descripción del item debe tener entre 10 y 250 caracteres'),

export const validateService = [
  body('id_branch')
    .notEmpty()
    .withMessage('El id de la sucursal es requerido')
    .isInt()
    .withMessage('El id de la sucursal debe ser un entero'),

  body('id_area')
    .notEmpty()
    .withMessage('El id del area es requerido')
    .isInt()
    .withMessage('El id del area debe ser un entero'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del servicio es requerido')
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre del servicio debe tener entre 5 y 100 caracteres'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripcion del servicio es requerido')
    .isLength({ min: 10, max: 300 })
    .withMessage('La descripcion del servicio debe tener entre 5 y 300 caracteres'),

  body('duration_min')
    .notEmpty()
    .withMessage('La duracion del servicio es requerida')
    .isInt()
    .withMessage('La duracion del servicio debe ser un entero'),

  body('price')
    .notEmpty()
    .withMessage('El precio del servicio es requerido')
    .isDecimal()
    .withMessage('El precio debe ser un decimal'),

  body('id_state')
    .notEmpty()
    .withMessage('El id del estado es requerido')
    .isInt()
    .withMessage('El id del estado debe ser un entero'),
]

export const validateServiceUpdate = [
  body('id_branch')
    .optional()
    .isInt()
    .withMessage('El id de la sucursal debe ser un entero'),

  body('id_area')
    .optional()
    .isInt()
    .withMessage('El id del area debe ser un entero'),
]

export const validateAreas = [
  body('id_branch')
    .notEmpty()
    .withMessage('El ID de la sucursal es requerido')
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del area es requerido')
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre del area debe tener entre 5 y 100 caracteres'),
  
  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
]

export const validateItemsUpdate = [
  body('name')
    .trim()
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('El nombre del item debe tener entre 5 y 50 caracteres'),

  body('description')
    .trim()
    .optional()
    .isLength({ min: 10, max: 250 })
    .withMessage('La descripción del item debe tener entre 10 y 250 caracteres'),
    
  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
    .withMessage('El ID del estado debe ser un número entero')
]

export const validateAreasUpdate = [
  body('id_branch')
    .optional()
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre del area debe tener entre 5 y 100 caracteres'),
  
  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero')
]

export const validateSpecialties = [
  body('id_branch')
    .notEmpty()
    .withMessage('El ID de la sucursal es requerido')
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),
  
  body('id_area')
    .notEmpty()
    .withMessage('El ID del area es requerido')
    .isInt()
    .withMessage('El ID del area debe ser un número entero'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del area es requerido')
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre del area debe tener entre 5 y 100 caracteres'),
  
  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero')
]

export const validateSpecialtiesUpdate = [
  body('id_branch')
    .optional()
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),
  
  body('id_area')
    .optional()
    .isInt()
    .withMessage('El ID del area debe ser un número entero'),
  
  body('name')
    .trim()
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre del servicio debe tener entre 5 y 100 caracteres'),
  
  body('description')
    .trim()
    .optional()
    .isLength({ min: 10, max: 300 })
    .withMessage('La descripcion del servicio debe tener entre 5 y 300 caracteres'),

  body('duration_min')
    .optional()
    .isInt()
    .withMessage('La duracion del servicio debe ser un entero'),

  body('price')
    .optional()
    .isDecimal()
    .withMessage('El precio debe ser un decimal'),

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El id del estado debe ser un entero'),
    .withMessage('El nombre del area debe tener entre 5 y 100 caracteres'),
  
  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero')
]