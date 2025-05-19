from django.shortcuts import render
from .models import Usuarios, Diciplina, Salas, Ambiente
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import UsuariosSerializer, LoginSerializer, DiciplinaSerializer, SalasSerializer, AmbienteSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import IsGestor 
from rest_framework.permissions import IsAuthenticated



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


class LoginView(TokenObtainPairView):
    serializer_class= LoginSerializer

        

class DiciplinaListCreatAPIView(ListCreateAPIView):
    serializer_class = DiciplinaSerializer
    def get_queryset(self):
        user = self.request.user
        if user.categoria == 'G':
            return Diciplina.objects.all()
        elif user.categoria == 'P':
            return Diciplina.objects.filter(professor= user)
        return Diciplina.objects.none()
    
    def get_permissions(self):
        user = self.request.user
        if self.request.method =='POST':
           return [IsGestor()]
        return [IsAuthenticated()]

class DiciplinaRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset =Diciplina.objects.all()
    serializer_class = DiciplinaSerializer
    lookup_field= 'pk'
    permission_classes = [IsGestor]


class SalasListCreatAPIView(ListCreateAPIView):
    queryset= Salas.objects.all()
    serializer_class = SalasSerializer
    permission_classes = [IsGestor]


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
            return Ambiente.objects.filter(professor= user)
        return Ambiente.objects.none()
    
    def get_permissions(self):
        user = self.request.user
        if self.request.method =='POST':
           return [IsGestor()]
        return [IsAuthenticated()]


class AmbienteRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset =Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    lookup_field= 'pk'
    permission_classes = [IsGestor]