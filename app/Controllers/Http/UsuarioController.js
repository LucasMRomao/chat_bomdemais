'use strict'

const Usuario = use("App/Models/User")

class UsuarioController {

    async index(){
        return Usuario.all()
    }

    async show({ params }){
        const user =  await Usuario.findOrFail(params.id)
        return user
    }

    async store({ request }){
        const data = request.only([ //Only recupera só os parametros indicado, ignorando os demais que forem passados na request
            'nome',
            'usuario',
            'senha'
        ])

        const usuario = await Usuario.create(data)
        return usuario
    }

    async update({ params, request }){
        const user =  await Usuario.findOrFail(params.id)
        const data = request.only([ //Only recupera só os parametros indicado, ignorando os demais que forem passados na request
            'nome',
            'usuario',
            'senha'
        ])
        
        user.merge(data)
        await user.save()
        return user
    }

    async destroy({ params }){
        const user =  await Usuario.findOrFail(params.id)
        return await user.delete()
    }

}

module.exports = UsuarioController
