# app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    
    path('usuarios/', view=views.UsuariosListCreatAPIView.as_view(), name='listar_criar_usuario'),
    path('usuarios/<int:pk>/', view=views.UsuariosRetrieveUpdateDestroyAPIView.as_view(), name='atualizar_deletar_visualizar_usuario'),

    
    path('login/', view=views.LoginView.as_view(), name='login'),

    
    path('disciplinas/', view=views.DiciplinaListCreatAPIView.as_view(), name='listar_criar_diciplina'),
    path('disciplinas/<int:pk>/', view=views.DiciplinaRetrieveUpdateDestroyAPIView.as_view(), name='atualizar_deletar_diciplina'),

    
    path('salas/', view=views.SalasListCreatAPIView.as_view(), name='listar_criar_salas'),
    path('salas/<int:pk>/', view=views.SalasRetrieveUpdateDestroyAPIView.as_view(), name='atualizar_deletar_salas'),

    
    path('ambientes/', view=views.AmbienteListCreateAPIView.as_view(), name='listar_criar_ambientes'),
    path('ambientes/<int:pk>/', view=views.AmbienteRetrieveUpdateDestroyAPIView.as_view(), name='atualizar_deletar_ambientes'),

    
]
