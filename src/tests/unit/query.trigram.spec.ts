// tests/unit/query.trigram.spec.ts
import { buildLuceneWithTrigrams } from "../../server/utils/helpers";

it("adds trigram fallback for simple multi-word query", () => {
  const out = buildLuceneWithTrigrams({
    userQuery: "clasification system",
    baseField: "allfields",
    baseLucene: '(allfields:("clasification" OR "system"))'
  });
  expect(out.q).toMatch(/_query_:"\{!field f=notation_ss\}clasification system"\^12/);
  expect(out.q).toMatch(/_query_:"\{!field f=alt_labels_ss\}clasification system"\^12/);
  expect(out.q).toMatch(/_query_:"\{!field f=title_trigram\}clasification system"\^0\.6/);
  expect(out.q).toMatch(/_query_:"\{!field f=allfields_trigram\}clasification system"\^0\.25/);
});

it("boosts exact abbreviation fields for global search", () => {
  const out = buildLuceneWithTrigrams({
    userQuery: "AAT",
    baseField: "allfields",
    baseLucene: '(allfields:("AAT"^3))'
  });
  expect(out.q).toMatch(/_query_:"\{!field f=notation_ss\}AAT"\^12/);
  expect(out.q).toMatch(/_query_:"\{!field f=alt_labels_ss\}AAT"\^12/);
});

it("does not add abbreviation boosts to title-only search", () => {
  const out = buildLuceneWithTrigrams({
    userQuery: "AAT",
    baseField: "title_search",
    baseLucene: '(title_search:("AAT"^3))'
  });
  expect(out.q).not.toMatch(/notation_ss/);
  expect(out.q).not.toMatch(/alt_labels_ss/);
});

it("skips trigram for advanced query", () => {
  const out = buildLuceneWithTrigrams({
    userQuery: 'title:"film classification"',
    baseField: "allfields",
    baseLucene: '(allfields:("film" OR "classification"))'
  });
  expect(out.q).not.toMatch(/trigram/);
});
