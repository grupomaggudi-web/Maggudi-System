# Arquitectura de Maggudi System

## Visión General

ERP omnicanal modular con arquitectura de microservicios lógicos.

## Estructura

```
Maggudi-System/
├── src/
│   ├── api/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── inventory/
│   │   │   ├── crm/
│   │   │   ├── sales/
│   │   │   └── ...
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── controllers/
│   ├── services/
│   ├── models/
│   ├── config/
│   └── server.js
├── tests/
├── docs/
└── package.json
```

## Capas

1. **Controllers** - Validación y respuestas
2. **Services** - Lógica de negocio
3. **Models** - Acceso a datos
4. **Config** - Configuración

## Seguridad

- JWT autenticación
- RBAC autorización
- HTTPS obligatorio
- Rate limiting
- SQL injection prevention
