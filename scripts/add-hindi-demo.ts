/**
 * One-off: publish a demo Hindi article linked as a translation of an
 * existing English story — proves fonts, lang tags, hreflang, the language
 * switch link, and same-language related content end to end.
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const p = (text: string) => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  children: [
    { type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 },
  ],
});

async function main() {
  const payload = await getPayload({ config });
  const ctx = { disableRevalidate: true };

  const existing = await payload.find({
    collection: 'articles',
    where: { slug: { equals: 'rajkoshiya-ghata-anuman-sanshodhan' } },
    limit: 1,
    depth: 0,
  });
  if (existing.totalDocs > 0) {
    console.log('Hindi demo article already exists — nothing changed.');
    process.exit(0);
  }

  const english = await payload.find({
    collection: 'articles',
    where: { slug: { equals: 'budget-fiscal-deficit-projection-revision' } },
    limit: 1,
    depth: 1,
  });
  const en = english.docs[0];
  if (!en) throw new Error('English source article not found — run npm run seed first');

  const doc = await payload.create({
    collection: 'articles',
    data: {
      title: 'केंद्र ने राजकोषीय घाटे का अनुमान घटाया — विश्लेषक आँकड़ों पर बँटे',
      slug: 'rajkoshiya-ghata-anuman-sanshodhan',
      language: 'hi',
      kicker: 'अर्थव्यवस्था',
      excerpt:
        'वित्त मंत्रालय ने राजकोषीय घाटे का संशोधित अनुमान जारी किया है। कुछ विश्लेषक इसे राजकोषीय अनुशासन की जीत मान रहे हैं, जबकि कुछ का कहना है कि आँकड़ों में लेखांकन के बदलाव छिपे हैं।',
      body: {
        root: {
          type: 'root',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          children: [
            p('वित्त मंत्रालय ने इस सप्ताह राजकोषीय घाटे का संशोधित अनुमान जारी किया, जो पिछले अनुमान से कम है। सरकार का दावा है कि कर संग्रह में वृद्धि और खर्च में अनुशासन इसकी मुख्य वजह हैं।'),
            p('हालाँकि, स्वतंत्र अर्थशास्त्रियों का एक वर्ग इन आँकड़ों को लेकर सतर्क है। उनका कहना है कि कुछ देनदारियाँ बजट से बाहर रखी गई हैं, जिससे असली तस्वीर धुंधली होती है।'),
            p('द क्विवर ने दोनों पक्षों के विशेषज्ञों से बात की और उपलब्ध सार्वजनिक दस्तावेज़ों की समीक्षा की। पूरी पड़ताल अंग्रेज़ी संस्करण में विस्तार से उपलब्ध है।'),
          ],
        },
      },
      category: typeof en.category === 'object' ? en.category.id : en.category,
      tags: Array.isArray(en.tags)
        ? en.tags.map((t) => (typeof t === 'object' ? t.id : t))
        : [],
      author: typeof en.author === 'object' ? en.author.id : en.author,
      heroImage:
        typeof en.heroImage === 'object' && en.heroImage ? en.heroImage.id : en.heroImage,
      verification: 'sourced',
      sourceCount: en.sourceCount ?? 2,
      translationOf: en.id,
      publishedAt: new Date().toISOString(),
      _status: 'published',
    },
    context: ctx,
  });
  console.log(`Hindi demo article published: /article/${doc.slug}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
