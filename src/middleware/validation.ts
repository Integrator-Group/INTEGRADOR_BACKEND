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