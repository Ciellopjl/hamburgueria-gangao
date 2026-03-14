import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user?.email !== "ciellolisboa023@gmail.com") {
    return NextResponse.json({ erro: 'Acesso negado' }, { status: 401 })
  }

  try {
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ erro: 'Imagem não fornecida' }, { status: 400 })
    }

    // O remove.bg espera a imagem limpa, sem o prefixo
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: base64Data,
        size: 'auto',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      try {
        const errorData = JSON.parse(errorText)
        console.error('Erro na API do Remove.bg:', JSON.stringify(errorData))
      } catch (e) {
        console.error('Erro na API do Remove.bg (Texto):', errorText)
      }
      
      return NextResponse.json(
        { erro: 'Falha ao processar a imagem na IA' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // O retorno da API em JSON vem no formato base64 no campo data.result_b64
    if (!data.data || !data.data.result_b64) {
         console.error('Formato de resposta inesperado:', JSON.stringify(data).substring(0, 200))
         throw new Error('Formato de resposta inesperado do remove.bg')
    }

    const resultBase64 = `data:image/png;base64,${data.data.result_b64}`

    return NextResponse.json({ result: resultBase64 })
  } catch (erro) {
    console.error('Erro interno ao processar imagem:', erro)
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
