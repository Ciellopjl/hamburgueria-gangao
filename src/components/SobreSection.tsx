'use client'

import { motion } from 'framer-motion'
import { Utensils, Award, Heart } from 'lucide-react'

export default function SobreSection() {
  const diferenciais = [
    {
      icone: <Utensils className="w-6 h-6" />,
      titulo: 'Artesanal de Verdade',
      descricao:
        'Cada hambúrguer é preparado na hora, com carne selecionada e temperos especiais da casa.',
    },
    {
      icone: <Award className="w-6 h-6" />,
      titulo: 'Qualidade Premium',
      descricao:
        'Ingredientes frescos e de primeira qualidade. Pães artesanais feitos diariamente.',
    },
    {
      icone: <Heart className="w-6 h-6" />,
      titulo: 'Feito com Amor',
      descricao:
        'Mais do que uma lanchonete, somos uma família que ama alimentar pessoas com sabor e carinho.',
    },
  ]

  return (
    <section id="sobre" className="section-padding bg-marca-preto relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">
            Conheça nossa história
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-6">
            Sobre o <span className="text-gradient">Mega Lanche</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Nascemos em Batalha, Alagoas, com um sonho: levar o melhor hambúrguer artesanal 
            da região para a sua mesa. Cada receita é fruto de dedicação e paixão pela 
            arte de fazer lanches incríveis.
          </p>
        </motion.div>

        {/* Cards de diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {diferenciais.map((item, index) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card p-8 text-center group card-hover"
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl 
                           bg-red-600/10 border border-red-600/20 text-red-500 mb-6
                           group-hover:bg-red-600/20 group-hover:border-red-500/40 
                           transition-all duration-300"
              >
                {item.icone}
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-white">
                {item.titulo}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.descricao}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
