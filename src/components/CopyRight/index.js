import React from 'react';
import { CopyrightOutlined } from '@ant-design/icons';

export default function ({ title }) {
  return (
    <div>
      Copyright <CopyrightOutlined /> {title}
    </div>
  );
}
