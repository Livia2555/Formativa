from .models import Usuarios,Disciplina,Salas,Ambiente
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:  # é necessária para associar o serializador com um modelo e definir o que será incluído ou excluído na serialização.
        model = Usuarios
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)  # Criptografa a senha
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # Criptografa a nova senha
        instance.save()
        return instance

class DisciplinaSerializer (serializers.ModelSerializer):
    professor = serializers.StringRelatedField()
    
    class Meta:
        model = Disciplina
        fields = '__all__'
        

class SalasSerializer (serializers.ModelSerializer):
    class Meta:
        model = Salas
        fields = '__all__'


class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'

    def validate(self, attrs):
        dataInicio = attrs.get('dataInicio')
        dataTermino = attrs.get('dataTermino')
        salas = attrs.get('salas')  
        periodo = attrs.get('periodo')

        conflito = Ambiente.objects.filter(
            salas=salas,
            periodo=periodo,
            dataInicio__lte=dataTermino,
            dataTermino__gte=dataInicio
        ).exists()

        if conflito:
            raise serializers.ValidationError("Esta sala já está reservada nesse período.")

        return attrs

    

class LoginSerializer (TokenObtainPairSerializer):
    def validate(self, attrs):
        data =  super().validate(attrs)
        data ['usuario'] = {
            'username': self.user.username,
            'email': self.user.email,
            'categoria':self.user.categoria

        }
        return data

class ObterTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only= True)

    def validate (self, attrs):
        username = attrs.get('username')
        password = attrs.get ('password')

        if username and password:
            usuario = authenticate(request=self.context.get('request'), username=username, password=password)

            if not usuario:
                raise serializers.ValidationError('Usuario ou senha invalido' ,code= 'authorization')
            
        else: 
            raise serializers.ValidationError('usuario e senha sao obrigatorios' ,code='authorization')
            
        attrs['usuario'] = UsuariosSerializer(usuario).data 
        return  attrs


