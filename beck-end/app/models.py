from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuarios (AbstractUser):
    CATEGORIA_ESCOLHA = [
        ('G','Gestores'),
        ('P','Professores')
    ]
    categoria = models.CharField(max_length=1,choices=CATEGORIA_ESCOLHA)

    NI= models.IntegerField(null=True, blank=True)
    nome = models.CharField(max_length=20)
    email = models.CharField(max_length=20)
    telefone =models.CharField(max_length=12, blank=True, null= True)
    dataNascimento= models.DateField(null=True, blank=True)
    dataContratacao = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nome or self.username

class Disciplina(models.Model):
    nome = models.CharField(max_length=20)
    curso = models.CharField(max_length=15)
    cargaHoraria = models.IntegerField()
    descricao = models.CharField(max_length=30)
    professor = models.ForeignKey(Usuarios , on_delete=models.CASCADE)

    def __str__(self):
        return self.nome

class Salas(models.Model):
    nome = models.CharField(max_length=20)

    def __str__(self):
        return self.nome

class Ambiente (models.Model):
    ESCOLHA_PERIODO = [
        ('M','Manhã'),
        ('T','Tarde'),
        ('N','Noite'),
    ]
    dataInicio= models.DateField()
    dataTermino= models.DateField()
    periodo = models.CharField(max_length=1,choices=ESCOLHA_PERIODO)
    salas = models.ForeignKey(Salas, on_delete=models.CASCADE)
    professor = models.ForeignKey(Usuarios , on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina , on_delete=models.CASCADE)
    nome = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.periodo



