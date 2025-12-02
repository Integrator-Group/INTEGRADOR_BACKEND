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