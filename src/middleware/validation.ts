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
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del estado de la cita debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del método debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validatePaymentStatus = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del estado de pago es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del estado de pago debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validatePaymentStatusUpdate = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del estado de pago debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del rol debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la provincia debe tener entre 2 y 100 caracteres'),

  body('id_state')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del cantón debe tener entre 2 y 100 caracteres'),

  body('id_province')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID de la provincia debe ser un número entero'),

  body('id_state')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateUser = [
  body('names')
    .trim()
    .notEmpty()
    .withMessage('Los nombres son requeridos')
    .isLength({ min: 2, max: 120 })
    .withMessage('Los nombres deben tener entre 2 y 120 caracteres'),

  body('last_names')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Los apellidos deben tener entre 1 y 120 caracteres'),

  body('identification')
    .trim()
    .notEmpty()
    .withMessage('La identificación es requerida')
    .isLength({ min: 1, max: 50 })
    .withMessage('La identificación debe tener entre 1 y 50 caracteres'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .isLength({ max: 120 })
    .withMessage('El email no puede exceder 120 caracteres'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('El teléfono debe tener entre 1 y 30 caracteres'),

  body('profile_photo')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('La URL de la foto de perfil debe tener entre 1 y 500 caracteres'),

  body('id_branch')
    .optional()
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),

  body('id_role')
    .notEmpty()
    .withMessage('El ID del rol es requerido')
    .isInt()
    .withMessage('El ID del rol debe ser un número entero'),

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
    .withMessage('El ID del cantón debe ser un número entero'),

  body('id_area')
    .optional()
    .isInt()
    .withMessage('El ID del área debe ser un número entero'),

  body('id_speciality')
    .optional()
    .isInt()
    .withMessage('El ID de la especialidad debe ser un número entero'),

  body('id_state')
    .notEmpty()
    .withMessage('El ID del estado es requerido')
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateUserUpdate = [
  body('names')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Los nombres deben tener entre 2 y 120 caracteres'),

  body('last_names')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Los apellidos deben tener entre 1 y 120 caracteres'),

  body('identification')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La identificación debe tener entre 1 y 50 caracteres'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .isLength({ max: 120 })
    .withMessage('El email no puede exceder 120 caracteres'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('El teléfono debe tener entre 1 y 30 caracteres'),

  body('profile_photo')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('La URL de la foto de perfil debe tener entre 1 y 500 caracteres'),

  body('id_branch')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),

  body('id_role')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID del rol debe ser un número entero'),

  body('id_province')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID de la provincia debe ser un número entero'),

  body('id_canton')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID del cantón debe ser un número entero'),

  body('id_area')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID del área debe ser un número entero'),

  body('id_speciality')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID de la especialidad debe ser un número entero'),

  body('id_state')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El username es requerido')
    .isLength({ min: 1, max: 80 })
    .withMessage('El username debe tener entre 1 y 80 caracteres'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 1 })
    .withMessage('La contraseña es requerida'),
];

export const validateCredentialsUpdate = [
  body('username')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('El username debe tener entre 1 y 80 caracteres'),

  body('password')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('La contraseña es requerida'),

  body('id_state')
    .optional({ checkFalsy: true })
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
]

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
    .withMessage('El ID del estado debe ser un número entero')
    .withMessage('El ID del estado debe ser un número entero'),
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
    .withMessage('El id del estado debe ser un entero')
    .withMessage('El nombre del area debe tener entre 5 y 100 caracteres'),
  
  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero')
]

export const validateSchedules = [
  body('day')
    .notEmpty()
    .withMessage('El día es requerido')
    .isString()
    .withMessage('El día debe ser una cadena de texto'),

  body('start_time')
    .notEmpty()
    .withMessage('La hora de inicio es requerida'),
    
  body('end_time')
    .notEmpty()
    .withMessage('La hora de fin es requerida'),
    
  body('is_available')
    .isBoolean()
    .withMessage('El estado de disponibilidad debe ser un booleano'),
]

export const validateSchedulesUpdate = [
  body('id_user')
    .optional()
    .isInt()
    .withMessage('El ID del usuario debe ser un número entero'),
  
  body('id_branch')
    .optional()
    .isInt()
    .withMessage('El ID de la sucursal debe ser un número entero'),

  body('day')
    .optional()
    .isString()
    .withMessage('El día debe ser una cadena de texto'),

  body('start_time')
    .optional(),
    
  body('end_time')
    .optional(),
    
  body('is_available')
    .optional()
    .isBoolean()
    .withMessage('El estado de disponibilidad debe ser un booleano'),
]