import WebIcon from "../icons/WebIcon.svg";
import AddIcon from "../icons/AddIcon.svg";
import * as S from "../ProductStyle";

export default function ProductDetailSheet({ product, onVisitWebsite, onAddToList }) {
  if (!product) return null;

  return (
    <S.DetailPage>
      <S.DetailHero>
        <S.DetailHeroTitle>{product.name}</S.DetailHeroTitle>
      </S.DetailHero>

      <S.DetailSection>
        <S.DetailSectionTitle>Key Features</S.DetailSectionTitle>
        <S.DetailParagraph>{product.keyFeatures}</S.DetailParagraph>
      </S.DetailSection>

      <S.DetailSection>
        {product.detailSections.map((section, sectionIndex) => (
          <S.DetailBlock key={section.title}>
            <S.DetailBlockTitle>{section.title}</S.DetailBlockTitle>
            {section.rows.map((row) => (
              <S.DetailRow key={`${section.title}-${row.label}`}>
                <S.DetailRowLabel>{row.label}</S.DetailRowLabel>
                <S.DetailRowValue $highlight={row.label === "Preferential Rate"}>{row.value}</S.DetailRowValue>
              </S.DetailRow>
            ))}
            {sectionIndex !== product.detailSections.length - 1 && <S.DetailDivider />}
          </S.DetailBlock>
        ))}
      </S.DetailSection>

      <S.DetailActions>
        <S.PrimaryButton type="button" onClick={() => onVisitWebsite?.(product.website)} disabled={!product.website}>
          <img src={WebIcon} alt="" width={20} height={20} />
          Official Website
        </S.PrimaryButton>
        <S.SecondaryButton type="button" onClick={() => onAddToList?.(product)}>
          <img src={AddIcon} alt="" width={20} height={20} />
          Add to List
        </S.SecondaryButton>
      </S.DetailActions>
    </S.DetailPage>
  );
}
