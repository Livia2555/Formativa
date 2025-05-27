from django.contrib import admin
from .models import Usuarios
from django.contrib.auth.admin import UserAdmin

class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets +(
        ('Campos Novos',{
            'fields':('NI', 'telefone','dataNascimento','dataContratacao','categoria')
        }),
    )
    add_fieldsets=UserAdmin.add_fieldsets +(
        ('Campos Novos',{
            'fields':('NI', 'telefone','dataNascimento','dataContratacao','categoria')
        }),
    )


admin.site.register(Usuarios,UsuarioAdmin)