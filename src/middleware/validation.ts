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

  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero'),
];

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
    .withMessage('El nombre del area debe tener entre 5 y 100 caracteres'),
  
  body('id_state')
    .optional()
    .isInt()
    .withMessage('El ID del estado debe ser un número entero')
]