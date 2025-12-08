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
    .notEmpty()
    .withMessage('El nombre del estado de la cita no puede estar vacío')
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
    .notEmpty()
    .withMessage('El nombre del estado de la cita no puede estar vacío')
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
    .notEmpty()
    .withMessage('El nombre del rol no puede estar vacío')
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
    .notEmpty()
    .withMessage('El nombre de la provincia no puede estar vacío')
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
    .notEmpty()
    .withMessage('El nombre del cantón no puede estar vacío')
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
]