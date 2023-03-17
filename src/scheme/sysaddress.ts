export type SysAddressItem = {
  id: string;
  country: string;
  provice: string;
  city: string;
  county: string;

  country_id: string;
  provice_id: string;
  city_id: string;
  county_id: string;

  zip_code: string;
  daddr: string;
  name: string;
  mobile: string;

  sort: number;

  created_at: string;
  updated_at: string;
  creator?: string;
};

export function concatenateDistricts(
  addr: SysAddressItem,
  { cat = ' ', withname = false, withzip = false, withmoible = false, reverse = false }
) {
  let darr = [];
  let rst = '';

  if (addr.country) {
    darr.push(addr.country);
  }
  if (addr.provice) {
    darr.push(addr.provice);
  }
  if (addr.city) {
    darr.push(addr.city);
  }
  if (addr.county) {
    darr.push(addr.county);
  }
  if (reverse) {
    darr = darr.reverse();
  }
  rst = darr.join(cat);

  if (withzip && addr.zip_code) {
    rst += ` ${addr.zip_code}`;
  }
  if (withname && addr.name) {
    rst += ` ${addr.name}`;
  }
  if (withmoible && addr.mobile) {
    rst += ` ${addr.mobile}`;
  }

  return rst;
}
