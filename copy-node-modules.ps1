New-Item -Force -ItemType Directory "./css" | Out-Null
New-Item -Force -ItemType Directory "./img" | Out-Null
New-Item -Force -ItemType Directory "./js" | Out-Null
New-Item -Force -ItemType Directory "./css/fonts" | Out-Null
Copy-Item -Force "./node_modules/bootstrap/dist/css/bootstrap.min.css" "./css/bootstrap.min.css"
Copy-Item -Force "./node_modules/bootstrap/dist/css/bootstrap.min.css.map" "./css/bootstrap.min.css.map"
Copy-Item -Force "./node_modules/bootstrap-icons/font/bootstrap-icons.css" "./css/bootstrap-icons.css"
Copy-Item -Force "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2" "./css/fonts/bootstrap-icons.woff2"
Copy-Item -Force "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff" "./css/fonts/bootstrap-icons.woff"
