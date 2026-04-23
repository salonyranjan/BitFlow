'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
  const [currency, setCurrency] = useState('usd');
  const [amount, setAmount] = useState('10');

  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0);

  return (
    <div id="converter">
      <h4>{symbol.toUpperCase()} Converter</h4>

      <div className="panel">
        <div className="input-wrapper">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
          <div className="coin-info">
            <Image src={icon} alt={symbol} width={20} height={20} />
            <p>{symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="divider">
          <div className="line" />

          <Image src="/converter.svg" alt="converter" width={32} height={32} className="icon" />
        </div>

        <div className="output-wrapper">
          <p>{formatCurrency(convertedPrice, 2, currency, false)}</p>

          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="select-trigger" value={currency}>
              <SelectValue placeholder="Select" className="select-value">
                {currency.toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="select-content" data-converter>
              {Object.keys(priceList).map((currencyCode) => (
                <SelectItem value={currencyCode} key={currencyCode} className="select-item">
                  {currencyCode.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
export default Converter;
