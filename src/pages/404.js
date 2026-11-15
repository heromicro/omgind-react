import React from 'react';
import { Link } from '@umijs/max';
import Exception from '@/components/Exception';

export default function () {
  return <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />;
}
