VERSION=0.0.2
NOMBRE="pilas.js"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m


comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${Y}${NOMBRE}${N} (versión: ${VERSION})"
	@echo ""
	@echo "  ${Y}Para desarrolladores${N}"
	@echo ""
	@echo "    ${G}iniciar${N}         Instala dependencias."
	@echo "    ${G}full${N}            Compila y ejecuta prueba en tiempo real."
	@echo "    ${G}test${N}            Ejecuta los tests de unidad."
	@echo "    ${G}docs${N}            Ejecuta los tests de unidad."
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version${N}         Genera una nueva versión."
	@echo "    ${G}subir_version${N}   Sube version generada al servidor."
	@echo ""

iniciar:
	npm install
	git submodule update --init

full:
	@grunt

version:
	# patch || minor
	@bumpversion patch --current-version ${VERSION} Makefile --list
	#make build
	@echo "Es recomendable escribir el comando que genera los tags y sube todo a github:"
	@echo ""
	@echo "make subir_version"

ver_sync: subir_version

subir_version:
	git commit -am 'release ${VERSION}'
	git tag '${VERSION}'
	git push
	git push --all
	git push --tags
	make changelog
	@git add CHANGELOG.txt
	@git commit -m "actualizando changelog."
	@git push

changelog:
	@git log `git describe --tags --abbrev=0` --pretty=format:"  * %s" > CHANGELOG.txt
	@echo "Generando el archivo CHANGELOG.txt"


test:
	@grunt qunit

docs:
	grunt typedoc

.PHONY: docs
