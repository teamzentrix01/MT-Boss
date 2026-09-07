import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBanner, isInternalBannerLink, isCloudinaryBannerImage, bannerImageUrl } from '../src/lib/hero-banner-fields.mjs';
import { defaultHeroBanners } from '../src/lib/hero-banner-defaults.mjs';

test('every service banner has valid English content, Cloudinary imagery and working site paths', () => {
  for (const banner of defaultHeroBanners) {
    assert.equal(validateBanner(banner, 'dwvfedqrb').error, undefined);
    assert.ok(banner.cta_text && banner.cta_href && banner.image_alt);
    assert.ok(isCloudinaryBannerImage(banner.image_url));
    assert.match(banner.title + banner.subtitle + banner.description, /^[\x20-\x7e]+$/);
  }
});
test('button destinations cannot navigate off-site or execute scripts', () => {
  for (const value of ['javascript:alert(1)', '//evil.test', '/\\evil.test', '/%2fexample.com', '/%5cexample.com', 'https://other.test', '/\n/evil.test']) assert.equal(isInternalBannerLink(value), false, value);
  for (const value of ['/quick', '/Services/all', '/buy-sale?type=home', '/contact#form']) assert.equal(isInternalBannerLink(value), true, value);
});
test('saving rejects incomplete buttons, overly long text and non-Cloudinary images', () => {
  const valid = defaultHeroBanners[0];
  for (const update of [{ cta_href: '' }, { title: 'x'.repeat(81) }, { image_url: '/uploads/local.jpg' }, { image_url: 'https://evil.test/image.jpg' }, { sort_order: -1 }, { image_position: 'invalid' }, { is_active: 'true' }]) assert.ok(validateBanner({ ...valid, ...update }).error);
  assert.ok(validateBanner(valid, 'another-account').error);
  assert.equal(validateBanner({ ...valid, cta_text: '', cta_href: '' }).error, undefined);
});
test('optimized delivery retains the Cloudinary version and public ID', () => {
  const image = defaultHeroBanners[0].image_url;
  const optimized = bannerImageUrl(image, 800);
  assert.ok(optimized.includes('/f_auto,q_auto,c_limit,w_800/'));
  assert.equal(optimized.split('/').slice(-4).join('/'), image.split('/').slice(-4).join('/'));
});
