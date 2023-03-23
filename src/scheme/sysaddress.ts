import { timeparts } from './common';

export type SysAddressItem = timeparts & {
  id: string;
  country: string;
  province: string;
  city: string;
  county: string;

  country_id: string;
  province_id: string;
  city_id: string;
  county_id: string;

  zip_code: string;
  daddr: string;

  last_name: string;
  first_name: string;

  area_code?: string;
  mobile: string;

  sort: number;
  is_active: boolean;

  creator?: string;
};

export function concatenateDistricts(
  addr: SysAddressItem,
  {
    cat = ' ',
    withFirstName = false,
    withLastName = false,
    withzip = false,
    withmoible = false,
    reverse = false,
    withDaddr = false,
  }
): string {
  let darr = [];
  let rst = '';
  if (!addr) {
    return '';
  }

  if (addr.country) {
    darr.push(addr.country);
  }
  if (addr.province) {
    darr.push(addr.province);
  }
  if (addr.city) {
    darr.push(addr.city);
  }
  if (addr.county) {
    darr.push(addr.county);
  }
  if (withDaddr && addr.daddr) {
    darr.push(addr.daddr);
  }
  if (reverse) {
    darr = darr.reverse();
  }
  rst = darr.join(cat);

  if (withzip && addr.zip_code) {
    rst += ` ${addr.zip_code}`;
  }

  let names = [];

  if (withLastName && addr.last_name) {
    names.push(addr.last_name);
  }

  if (withFirstName && addr.first_name) {
    names.push(addr.first_name);
  }

  if (reverse) {
    names = names.reverse();
  }

  if (names) {
    let namesStr = names.join(' ');
    rst += ` ${namesStr}`;
  }

  if (withmoible && addr.mobile) {
    rst += ` ${addr.mobile}`;
  }

  return rst;
}

export function collectionDistrictIDs(addr: SysAddressItem): string[] {
  let ids = [];
  if (!addr) {
    return ids;
  }
  if (addr.country_id) {
    ids.push(addr.country_id);
  }
  if (addr.province_id) {
    ids.push(addr.province_id);
  }
  if (addr.city_id) {
    ids.push(addr.city_id);
  }
  if (addr.county_id) {
    ids.push(addr.county_id);
  }

  return ids;
}
