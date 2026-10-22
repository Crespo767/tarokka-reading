# Arte de Madame Eva

Registro histórico da primeira preparação. A cena atual usa `tarokka-reading/assets/madam-eva-seated.webp`; as imagens originais e os recortes anteriores estão preservados em `backups/asset-sources/`, desde a otimização 2.9.0.

Referência: `tarokka-reading/assets/madam-eva.png`, já existente no projeto e correspondente à imagem fornecida pelo usuário. O original foi preservado.

Arquivo consumido pela cena: `tarokka-reading/assets/madam-eva-cutout.png`.

Preparado com a ferramenta integrada de geração/edição de imagens (`image_gen`), com fundo transparente. A ferramenta pode reinterpretar pequenos detalhes da ilustração; esta versão foi inspecionada visualmente antes de integrar à cena. Não foi usado o fallback de API/CLI.

Prompt final usado:

> Use case: background-extraction. Edit target: supplied original illustration of Madam Eva. Produce a game sprite on genuinely TRANSPARENT background. Extract ONLY the original elderly fortune teller woman, including both full arms/hands, hood, head, gold headband coins, necklaces, robes, and the single tarot card held in her raised hand. Preserve her exact original aged face, crooked smile, deep wrinkles, long nose, hood shape, pose, warm orange illumination, brushwork, and original colors. Remove the entire castle/rain/blue background and remove ALL floating cards, smoke and glow around her body. Do not redesign, beautify, make younger, or invent any new character. Smooth clean alpha edges, no background shadows or colored rectangle, no letters, no watermark. Portrait canvas with whole silhouette fitted and a little transparent space around her. Intended as 2.5D billboard character behind a real 3D table.
