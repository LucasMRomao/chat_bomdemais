'use strict'

const Mensagem = use("App/Models/Mensagem")

class MensagemController {

    async index(){
        return Mensagem.all()
    }

    async show({ params }){
        const mensagem =  await Mensagem.findOrFail(params.id)
        return mensagem
    }

    async store({ request }){
        const data = request.only([ //Only recupera só os parametros indicado, ignorando os demais que forem passados na request
            'id_usuario_envia',
            'id_usuario_recebe',
            'mensagem'
        ])

        const mensagem = await Mensagem.create(data)
        return mensagem
    }

    async update({ params, request }){
        const mensagem =  await Mensagem.findOrFail(params.id)
        const data = request.only([ //Only recupera só os parametros indicado, ignorando os demais que forem passados na request
            'id_usuario_envia',
            'id_usuario_recebe',
            'mensagem'
        ])
        
        mensagem.merge(data)
        await mensagem.save()
        return mensagem
    }

    async destroy({ params }){
        const mensagem =  await Mensagem.findOrFail(params.id)
        return await mensagem.delete()
    }

    async getMensagensEntreUsuarios({ request }){
        const data = request.only([
            'usuario1',
            'usuario2'
        ])
        return Mensagem.getMensagensEntreUsuarios(data)
    }

}

module.exports = MensagemController
