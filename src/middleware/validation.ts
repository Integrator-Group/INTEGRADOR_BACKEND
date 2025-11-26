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