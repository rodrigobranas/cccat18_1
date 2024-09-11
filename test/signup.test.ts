import request from 'supertest';
// import wtfnode from 'wtfnode'; // pega o dump das requisições
import {
  describe, expect, it, jest,
} from '@jest/globals';
import signup from '../src/signup';
import app from '../src/signup';

// iniciando o servidor
let server: any;
beforeAll((done) => {
  server = app.listen(3000, done); // Use a porta 3000 para o servidor de teste
});

afterAll((done) => {
  if (server) {
    server.close((err: Error | null) => {
      if (err) {
        console.error('Erro ao fechar o servidor:', err);
      } else {
        console.log('Servidor fechado com sucesso');
      }
      done();
    });
  } else {
    done();
  }
});

describe('POST em /signup', () => {
  it('Deve adicionar um novo usuario', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius Delboni",
        "email": "vinicius.delboni@gmail.com",
        "cpf": "10704741776",
        "car_plate": "BKL1660",
        "is_passenger": true,
        "is_driver": false,
        "password": "v!n!1660"   
      })
      .expect(200);
  });

  it('Deve retornar 422 quando email já existe', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius Delboni",
        "email": "vinicius.delboni@gmail.com",
        "cpf": "10704741776",
        "car_plate": "BKL1660",
        "is_passenger": true,
        "is_driver": false,
        "password": "v!n!1660"   
      })
      .expect(422);

      expect(resposta.body.message).toEqual('Email já cadastrado');
  });
  it('Deve adicionar um novo motorista', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius Delboni",
        "email": "vini.motorista@gmail.com",
        "cpf": "10704741776",
        "car_plate": "BKL1660",
        "is_passenger": false,
        "is_driver": true,
        "password": "v!n!1660"   
      })
      .expect(200);
  });

  it('Deve retornar 422 quando email já existe', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius Delboni",
        "email": "vini.motorista@gmail.com",
        "cpf": "10704741776",
        "car_plate": "BKL1660",
        "is_passenger": false,
        "is_driver": true,
        "password": "v!n!1660"   
      })
      .expect(422);

      expect(resposta.body.message).toEqual('Email já cadastrado');
  });

  it('Deve retornar 422 quando nome invalido', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius",
        "email": "vini1.motorista@gmail.com",
        "cpf": "10704741776",
        "car_plate": "BKL1600",
        "is_passenger": false,
        "is_driver": true,
        "password": "v!n!1660"   
      })
      .expect(422);

      expect(resposta.body.message).toEqual('Nome Inválido');
  });

  it('Deve retornar 422 quando email invalido', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius D",
        "email": "vini1.motoristagmail.com",
        "cpf": "10704741776",
        "car_plate": "BKL1600",
        "is_passenger": false,
        "is_driver": true,
        "password": "v!n!1660"   
      })
      .expect(422);

      expect(resposta.body.message).toEqual('Email Inválido');
  });
  it('Deve retornar 422 quando CPF invalido', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius D",
        "email": "vini1.motorista@gmail.com",
        "cpf": "107047417",
        "car_plate": "BKL1600",
        "is_passenger": false,
        "is_driver": true,
        "password": "v!n!1660"   
      })
      .expect(422);

      expect(resposta.body.message).toEqual('CPF Inválido');
  });
  it('Deve retornar 422 quando Placa invalido', async () => {
    const resposta = await request(signup)
      .post('/signup')
      .send({
        "name": "Vinicius D",
        "email": "vini1.motorista@gmail.com",
        "cpf": "10704741776",
        "car_plate": "BK600",
        "is_passenger": false,
        "is_driver": true,
        "password": "v!n!1660"   
      })
      .expect(422);

      expect(resposta.body.message).toEqual('Placa Inválida');
  });
});
