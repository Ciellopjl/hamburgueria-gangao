import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const database = new Database('prisma/dev.db')
const adapter = new PrismaBetterSqlite3({ url: 'file:prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.pedido.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.promocao.deleteMany()
  await prisma.categoria.deleteMany()

  // Criar categorias
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: { nome: 'hamburguer-artesanal', label: 'Hambúrguer Artesanal', icone: '🍔' },
    }),
    prisma.categoria.create({
      data: { nome: 'hamburguer-na-brasa', label: 'Hambúrguer na Brasa', icone: '🔥' },
    }),
    prisma.categoria.create({
      data: { nome: 'salgados', label: 'Salgados', icone: '🥟' },
    }),
    prisma.categoria.create({
      data: { nome: 'porcoes', label: 'Porções', icone: '🍟' },
    }),
    prisma.categoria.create({
      data: { nome: 'milkshakes', label: 'Milk-shakes', icone: '🥤' },
    }),
    prisma.categoria.create({
      data: { nome: 'doces', label: 'Doces', icone: '🍰' },
    }),
    prisma.categoria.create({
      data: { nome: 'bebidas', label: 'Bebidas', icone: '🧃' },
    }),
  ])

  const [artesanal, brasa, salgados, porcoes, milkshakes, doces, bebidas] = categorias

  // Criar produtos
  const produtos = [
    // Hambúrguer Artesanal
    {
      nome: 'Gangão Clássico',
      descricao: 'Pão brioche, hambúrguer artesanal 180g, queijo cheddar, alface, tomate e molho especial da casa.',
      preco: 25.90,
      imagem: '/produtos/gangao-classico.jpg',
      categoriaId: artesanal.id,
      badge: 'Mais Vendido',
    },
    {
      nome: 'Gangão Duplo',
      descricao: 'Pão brioche, 2 hambúrgueres artesanais 180g, queijo cheddar duplo, bacon crocante e molho barbecue.',
      preco: 35.90,
      imagem: '/produtos/gangao-duplo.jpg',
      categoriaId: artesanal.id,
    },
    {
      nome: 'Gangão Especial',
      descricao: 'Pão australiano, hambúrguer artesanal 200g, queijo provolone, cebola caramelizada e rúcula.',
      preco: 32.90,
      imagem: '/produtos/gangao-especial.jpg',
      categoriaId: artesanal.id,
      badge: 'Novo',
    },
    {
      nome: 'Gangão Bacon Supreme',
      descricao: 'Pão brioche, hambúrguer 180g, muito bacon crocante, queijo cheddar, ovo e molho especial.',
      preco: 34.90,
      imagem: '/produtos/gangao-bacon.jpg',
      categoriaId: artesanal.id,
    },
    // Hambúrguer na Brasa
    {
      nome: 'Brasa Original',
      descricao: 'Hambúrguer grelhado na brasa 200g, pão artesanal, queijo coalho, alface e tomate.',
      preco: 28.90,
      imagem: '/produtos/brasa-original.jpg',
      categoriaId: brasa.id,
      badge: 'Destaque',
    },
    {
      nome: 'Brasa Defumado',
      descricao: 'Hambúrguer defumado na brasa 200g, queijo provolone, cebola roxa grelhada e molho chimichurri.',
      preco: 33.90,
      imagem: '/produtos/brasa-defumado.jpg',
      categoriaId: brasa.id,
    },
    {
      nome: 'Brasa Picante',
      descricao: 'Hambúrguer na brasa 200g com pimenta, jalapeño, queijo pepper jack e molho sriracha.',
      preco: 31.90,
      imagem: '/produtos/brasa-picante.jpg',
      categoriaId: brasa.id,
    },
    // Salgados
    {
      nome: 'Coxinha de Frango',
      descricao: 'Coxinha crocante recheada com frango desfiado e catupiry. Unidade.',
      preco: 7.90,
      imagem: '/produtos/coxinha.jpg',
      categoriaId: salgados.id,
    },
    {
      nome: 'Pastel de Carne',
      descricao: 'Pastel frito crocante recheado com carne moída temperada. Unidade.',
      preco: 8.90,
      imagem: '/produtos/pastel.jpg',
      categoriaId: salgados.id,
    },
    {
      nome: 'Empada de Frango',
      descricao: 'Empada caseira com recheio cremoso de frango. Unidade.',
      preco: 6.90,
      imagem: '/produtos/empada.jpg',
      categoriaId: salgados.id,
    },
    // Porções
    {
      nome: 'Batata Frita Grande',
      descricao: 'Porção generosa de batata frita crocante com sal e temperos especiais.',
      preco: 19.90,
      imagem: '/produtos/batata-frita.jpg',
      categoriaId: porcoes.id,
    },
    {
      nome: 'Onion Rings',
      descricao: 'Anéis de cebola empanados e fritos, acompanha molho especial.',
      preco: 22.90,
      imagem: '/produtos/onion-rings.jpg',
      categoriaId: porcoes.id,
    },
    {
      nome: 'Nuggets (12 un)',
      descricao: 'Nuggets crocantes de frango, acompanha molho barbecue.',
      preco: 18.90,
      imagem: '/produtos/nuggets.jpg',
      categoriaId: porcoes.id,
    },
    // Milk-shakes
    {
      nome: 'Milk-shake Chocolate',
      descricao: 'Milk-shake cremoso de chocolate belga com chantilly e granulado.',
      preco: 16.90,
      imagem: '/produtos/milkshake-chocolate.jpg',
      categoriaId: milkshakes.id,
    },
    {
      nome: 'Milk-shake Morango',
      descricao: 'Milk-shake de morango fresco com calda e chantilly.',
      preco: 16.90,
      imagem: '/produtos/milkshake-morango.jpg',
      categoriaId: milkshakes.id,
    },
    {
      nome: 'Milk-shake Ovomaltine',
      descricao: 'Milk-shake com Ovomaltine crocante, calda de chocolate e chantilly.',
      preco: 18.90,
      imagem: '/produtos/milkshake-ovomaltine.jpg',
      categoriaId: milkshakes.id,
      badge: 'Favorito',
    },
    // Doces
    {
      nome: 'Brownie com Sorvete',
      descricao: 'Brownie quentinho de chocolate com bola de sorvete de creme e calda.',
      preco: 14.90,
      imagem: '/produtos/brownie.jpg',
      categoriaId: doces.id,
    },
    {
      nome: 'Pudim de Leite',
      descricao: 'Pudim caseiro de leite condensado com calda de caramelo.',
      preco: 9.90,
      imagem: '/produtos/pudim.jpg',
      categoriaId: doces.id,
    },
    // Bebidas
    {
      nome: 'Coca-Cola Lata',
      descricao: 'Coca-Cola lata 350ml gelada.',
      preco: 6.90,
      imagem: '/produtos/coca-cola.jpg',
      categoriaId: bebidas.id,
    },
    {
      nome: 'Guaraná Antarctica Lata',
      descricao: 'Guaraná Antarctica lata 350ml gelado.',
      preco: 5.90,
      imagem: '/produtos/guarana.jpg',
      categoriaId: bebidas.id,
    },
    {
      nome: 'Suco Natural de Laranja',
      descricao: 'Suco natural de laranja 500ml, feito na hora.',
      preco: 10.90,
      imagem: '/produtos/suco-laranja.jpg',
      categoriaId: bebidas.id,
    },
    {
      nome: 'Água Mineral 500ml',
      descricao: 'Água mineral sem gás 500ml.',
      preco: 3.90,
      imagem: '/produtos/agua.jpg',
      categoriaId: bebidas.id,
    },
  ]

  for (const produto of produtos) {
    await prisma.produto.create({ data: produto })
  }

  // Criar promoções
  await Promise.all([
    prisma.promocao.create({
      data: {
        titulo: 'Combo Gangão',
        descricao: 'Gangão Clássico + Batata Frita + Refrigerante por apenas R$ 39,90!',
        tag: 'COMBO',
        icone: '🎉',
        cor: 'from-red-600 to-red-800',
        corBorda: 'border-red-500',
      },
    }),
    prisma.promocao.create({
      data: {
        titulo: 'Terça do Dobro',
        descricao: 'Toda terça-feira: compre 1 hambúrguer e leve 2!',
        tag: 'TERÇA',
        icone: '🔥',
        cor: 'from-orange-500 to-red-600',
        corBorda: 'border-orange-400',
      },
    }),
    prisma.promocao.create({
      data: {
        titulo: 'Frete Grátis',
        descricao: 'Pedidos acima de R$ 50 com entrega grátis em Batalha!',
        tag: 'ENTREGA',
        icone: '🛵',
        cor: 'from-green-600 to-emerald-700',
        corBorda: 'border-green-400',
      },
    }),
  ])

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📦 ${produtos.length} produtos criados`)
  console.log(`📂 ${categorias.length} categorias criadas`)
  console.log('🎁 3 promoções criadas')
}

main()
  .catch((erro) => {
    console.error('❌ Erro no seed:', erro)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
