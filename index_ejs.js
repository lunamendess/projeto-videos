(async () => {

   const express = require('express')
   const app = express()
   const db = require("./db.js")
   const url = require("url")
   const port = 3000

   app.set("view engine", "ejs")

   app.use(express.static('projeto-videos'))
   app.use("/imgs", express.static("imgs"))
   app.use("/js", express.static("js"))
   app.use("/css", express.static("css"))

   const consulta = await db.selectFilmes()
   const consultaCarrinho = await db.selectCarrinho()
   // const insertCarrinho = await db.insertCarrinho()
   // const consultaCupom = await db.selectCupom()
   const deleteItemCarrinho = await db.deleteItemCarrinho()
   // const limpaCarrinho = await db.deleteAllCarrinho()
   consultaFilmes = await db.selectFilmes()

   app.get("/", async (req, res) => {
      res.render(`index`, {
         titulo: " Conheça os nossos Filmes",
         promo: " Todos os Filmes com 10% de desconto !",
         filmes: consulta,
         galeria: consultaFilmes
      })
   })

  app.get("/produtos", (req, res) => {
      res.render(`produtos`, {
         galeria: consultaFilmes
      })
   })

   app.get("/contato", (req, res) => {
      res.render(`contato`)
   })

   app.get("/cadastro", (req, res) => {
      res.render(`cadastro`)
   })

   app.get("/login", (req, res) => {
      res.render(`login`)
   })

   app.get("/carrinho", (req, res) => {
      res.render(`carrinho`, {
         carrinho: consultaCarrinho,
         deleteItemCarrinho: deleteItemCarrinho,
         // limpaCarrinho: limpaCarrinho
         // cupom: consultaCupom
      })
   })

//    app.post("/carrinho", async (req, res) => {
//       const info = req.body
//       await db.insertCarrinho({
//           produto: info.filmes_id
//       })
//       res.send(req.body)
//   })

   app.get("/promocoes", async (req, res) => {
      const consultaPromo = await db.selectPromo()
      res.render(`promocoes`, {
         filmes: consulta,
         galeria: consultaPromo
      })
   })

   app.get("/single", async (req, res) => {
      let infoUrl = req.url
      let urlProp = url.parse(infoUrl, true)
      let q = urlProp.query
      const consultaSingle = await db.selectSingle(q.id)
      const consultaInit = await db.selectSingle(4)
      res.render(`single`, {
         filmes: consulta,
         galeria: consultaSingle,
         inicio: consultaInit
      })
   })

   app.get("/atualiza-promo", async (req, res) => {
      let qs = url.parse(req.url, true).query
      await db.updatePromo(qs.promo, qs.id)//localhost:3000/atualiza-promo?promo=1&id=1
      res.send("<h2>Lista de promoções atualizada!</h2><a href='./promocoes'>Voltar</a>")
   })

   app.get("/upd-promo", async (req, res) => {
      res.render(`adm/atualiza-promocoes`, {
         filmes: consulta,
         filmes: consultaFilmes
      })
   })

   app.post("/delete-carrinho", async (req, res) => {
      const info = req.body
      await db.deleteItemCarrinho(info.id)
      res.send(info)
  })

   app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))

})()
