# 🛍️ ISA Making

El sistema de información está diseñado para gestionar todo el proceso de compra, desde la selección del producto hasta el pago final, integrando funcionalidades que permiten al cliente elegir ciertos aspectos de la prenda como el color y talla. Además, permite agregar al carrito, hacer la compra y rastreo del envío con un delivery como Interrapidísimo. Los administradores también pueden gestionar los productos.

## 📑 Tabla de Contenido

1. Características Principales

2. Stack Tecnológico

3. Arquitectura del Sistema

4. Flujos del Sistema

## 🚀 Características Principales

El sistema incluye funcionalidades clave como:

-   Catalogo de productos
-   Autenticacion con credenciales y proveedores (google, behance)
-   Edcion de prendas ( impresion frontal, trasera, mangas, etiqueta interior/exterior )
-   Pasarela de pago
-   Rastreo de envío

## **💻 STACK TECNOLÓGICO:**

### **FRONTEND:**

-   Next.js
-   Tailwind CSS v4
-   DaisyUI

### **BACKEND:**

-   Next API (App Router)
-   Sequelize CLI with MySQL
-   PayU

## 🏗️ Arquitectura del sistema 
El sistema está basado en una arquitectura cliente-servidor clásica, donde el frontend y el backend están claramente separados, pero trabajan de forma coordinada a través de peticiones HTTP. Esta arquitectura es ideal para aplicaciones web donde se requiere una experiencia dinámica para el usuario y un control robusto desde el servidor.

## 🔄 Flujos del Sistema

### **🚶‍♂️ Flujo de Usuario**

1. **Login:** El usuario se autentica a través de credenciales o proveedores como Google o Behance.
2. **Visualización de Productos:** El usuario puede ver el catálogo de productos, incluyendo detalles como color, talla, y edición de prendas.
3. **Agregar al Carrito:** El usuario puede agregar productos al carrito de compras.
4. **Pago:** El usuario puede realizar el pago a través de la pasarela de pago integrada.
5. **Rastreo de Envío:** El usuario puede ver el rastro de su guía de envío.

### **🚧 Flujo de Administrador**

1. **Edición de Productos:** Los administradores pueden editar los productos, incluyendo detalles como color, talla, y edición de prendas.
