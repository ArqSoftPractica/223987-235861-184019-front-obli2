## Arquitectura de software en la práctica - Frontend - Obligatorio 1
Docentes: Nicolás Fornaro y Guillermo Areosa

Evelyn Jodus (223987), Hernán Reyes (235861), Michael Ellis (184019)

4 de Mayo de 2023
_____________________________________________________________________________________________

## Contenido de este Repositorio
- [Introducción](#intro)
- [Tecnologías utilizadas](#tecnologias)
- [Diagramas de vistas](#vistas)
- [Docker Compose](#docker)
- [Guía de despliegue](#despliegue)

## 1. Introducción<a name="intro"></a>

A lo largo de este repositorio se detallarán distintos aspectos importantes con lo que respecta al frontend de esta aplicación.

La aplicación que se nos solicitó desarrollar tiene como base el manejo de inventario para empresas. 
El principal objetivo por el cual se crea es para lograr reducir errores humanos y mejorar la eficiencia en la gestión del inventario. 
Basándonos, tanto en los requerimientos funcionales como en los no funcionales es que surge esta aplicación basada en roles. Más adelante en la documentación, detallaremos las distintas acciones capaces de realizar cada uno de los roles que se encuentran en nuestro sistema, pero adelantaremos que contaremos tanto con Administradores como con Empleados.

## 2.Tecnologías utilziadas  <a name="tecnologias"></a>

### Desarrollo
Para esta primera versión. el equipo determinó tener una arquitectura monolítica cloud native por ser la más apropiada. 
A continuación detallaremos las decisiones de tecnologías utilizadas: 

### Frontend
Para el desarrollo del Frontend se utilizó React con Material UI.
Motivos por los cuales se utilizó React:
El manejo de componentes nos da acceso al desarrollo de una aplicación escalable y sencilla de mantener
El interés de poder usar una tecnología muy importante en el mercado hoy en día
Como es una plataforma de código abierto, podemos hacer uso de librerías de forma gratuita
Motivos por los cuales se utilizó Material UI: 
Dado a que no somos diseñadores, ni el tiempo dado nos alcanzaría para hacer diseño puro de todos los componentes que necesitamos, esta librería (que sigue los diseños de de Material Design de Google) nos permite lograr un diseño digno y atractivo para el usuario en poco tiempo y sin tener conocimientos de diseño expertos que necesitamos para el caso

#### Despliegue 
Para el despliegue de la aplicación Frontend utilizamos AWS. La misma fue elegida por ser la ejemplificada en el curso. 
Más adelante en el Readme se tendrá acceso a la guia de despliegue utilizada

## 2.Diagramas de vistas  <a name="vistas"></a>
Describiremos la arquitectura de nuestro sistema representados con las distintas vistas de arquitectura. Cada una de ellas nos provee de distintos detalles del sistema, así pudiendo llegar a lo que es el mismo en su completitud.

### Vista de módulos 
Las vistas de módulos se usan para presupuestar, estimar y asignar tareas y seguimiento de los proyectos. Además, a nivel de la construcción, nos proveen una especie de plano que refleja el código fuente. También nos ayudan a analizar que impacto de las modificaciones. Por último, podemos decir que son muy útiles para poder instruir a nuevos desarrolladores.

#### Vista de descomposición 
En la vista de descomposición podemos describir la estructura jerárquica del sistema, partiendo del elemento de más alto nivel y documentando así de forma recursiva los elementos de la jerarquía.

![image](https://user-images.githubusercontent.com/44271850/236274697-2edde2cc-b9ac-4a14-bdd4-81ea806ce687.png)

#### Vista de usos
La siguiente vista describe las dependencias de usos entre los módulos del sistema

![image](https://user-images.githubusercontent.com/44271850/236274765-1ac80467-7dda-4b41-afcc-44dcca5de17f.png)

## 5. Docker Compose <a name= "docker"></a>

En el repositprio se podrá acceder al archivo docker-compose.yml. Gracias a este archivo, ejecutando únicamente el comando docker-compose up logramos levantar la aplicación de frontend.

## 6. Guia de despliegue <a name= "despliegue"></a>

A continuación presentaremos el paso a paso que realizamos para completar el despliegue del frontend en AWS.

Paso 1: Creamos el bucket, desde la pantalla de amazon de s3/buckets damos click en el botón “Crear bucket”

![image](https://user-images.githubusercontent.com/44271850/236276718-ba603851-115b-4587-a14e-dcbe8e96c1c5.png)

Paso 2: Configuramos el bucket

![image](https://user-images.githubusercontent.com/44271850/236276818-c24c4681-5921-4462-9a7b-dfb33a058969.png)

![image](https://user-images.githubusercontent.com/44271850/236276875-01c3a483-7cdf-412b-bfdc-3e341dbf8cd9.png)

![image](https://user-images.githubusercontent.com/44271850/236276936-1464ea14-037b-435c-b550-1ea8c151df8e.png)

El resto de las opciones las dejamos por defecto.

Paso 3: Cargamos los objetos de nuestro frontend luego de hacer npm run build. Para esto es necesario ingresar al bucket creado e ir a la pestaña objetos.

![image](https://user-images.githubusercontent.com/44271850/236277092-45889e0c-07a5-411c-99e3-7084f1983f1f.png)

En esta misma pantalla arrastramos nuestros archivos que se encuentran en la carpeta build que se generó luego de hacer npm run build en la aplicación react.

![image](https://user-images.githubusercontent.com/44271850/236277169-34c2f1b6-20d9-428e-9887-cde30ce43df9.png)

Luego de cargar los objetos damos click en cargar.

![image](https://user-images.githubusercontent.com/44271850/236277238-e9e6de78-e451-4e33-846f-f66312be1d8a.png)

Paso 4: En la tab “Propiedades” configuramos para que el bucket permita el alojamiento de sitios web estáticos.

![image](https://user-images.githubusercontent.com/44271850/236277334-a7ddcf2c-12af-4a4a-ab60-510ba655ea37.png)

En la sección de “Alojamiento de sitios web estáticos” damos click en “Editar”.

![image](https://user-images.githubusercontent.com/44271850/236277432-569e5dfc-66e2-4992-adf3-8d306cd8c911.png)

Dentro realizamos la siguiente configuración

![image](https://user-images.githubusercontent.com/44271850/236277516-75845c5b-63cb-4216-924f-77ae96409787.png)

Por último guardamos los cambios.
Paso 5: Configurar la política del bucket desde la tab de Permisos.
{
  "Version": "2012-10-17",
  "Id": "MyPolicy",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::frontend-ellis-jodus-reyes/*"
    }
  ]
}
![image](https://user-images.githubusercontent.com/44271850/236277828-1966545f-fd7c-4f0b-b11b-0d14ea6f862c.png)



