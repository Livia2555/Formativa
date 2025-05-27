from django.shortcuts import render
from .models import Usuarios, Disciplina, Salas, Ambiente
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import UsuariosSerializer, LoginSerializer, DisciplinaSerializer, SalasSerializer, AmbienteSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import IsGestor 
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework import status



class UsuariosPaginacao(PageNumberPagination):
    page_size= 30
    page_size_query_param = 'page_size'
    max_page_size=20


class UsuariosListCreatAPIView(ListCreateAPIView):
    queryset= Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    pagination_class = UsuariosPaginacao

    def get_queryset(self):
        user = self.request.user

        if user.categoria == 'G':
            # Se veio um filtro de categoria na URL (?categoria=P), aplica o filtro
            categoria = self.request.query_params.get('categoria')
            
            if categoria:
                return Usuarios.objects.filter(categoria=categoria)
            return Usuarios.objects.all()

        if user.categoria == 'P':
            return Usuarios.objects.filter(id=user.id)

        return Usuarios.objects.none()

        
class UsuariosRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset =Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    lookup_field= 'pk'

    def get_permissions(self):
        user = self.request.user
        if self.request.method =='DELETE':
           return [IsGestor()]
        return [IsAuthenticated()]


class LoginView(TokenObtainPairView):
    serializer_class= LoginSerializer

        

class DisciplinaListCreatAPIView(ListCreateAPIView):
    serializer_class = DisciplinaSerializer
    def get_queryset(self):
        user = self.request.user
        if user.categoria == 'G':
            return Disciplina.objects.all()
        elif user.categoria == 'P':
            return Disciplina.objects.filter(professor= user)
        return Disciplina.objects.none()
    
    def get_permissions(self):
        user = self.request.user
        if self.request.method =='POST':
           if user.categoria == 'G':
            return [IsGestor()]
        return [IsAuthenticated()]

class DisciplinaRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset =Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    lookup_field= 'pk'
    permission_classes = [IsGestor]


class SalasListCreatAPIView(ListCreateAPIView):
    queryset = Salas.objects.all()
    serializer_class = SalasSerializer
    permission_classes = [IsGestor]

    def perform_create(self, serializer):
        print("Usuário:", self.request.user)
        print("Categoria:", getattr(self.request.user, "categoria", None))
        serializer.save()


class SalasRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset =Salas.objects.all()
    serializer_class = SalasSerializer
    lookup_field= 'pk'
    permission_classes = [IsGestor]

class AmbienteListCreateAPIView(ListCreateAPIView):
    serializer_class = AmbienteSerializer

    def get_queryset(self):
        user = self.request.user
        if user.categoria == 'G':
            return Ambiente.objects.all()
        elif user.categoria == 'P':
            return Ambiente.objects.filter(professor=user)
        return Ambiente.objects.none()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsGestor()]
        return [IsAuthenticated()]


class AmbienteRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    lookup_field = 'pk'
    permission_classes = [IsGestor]