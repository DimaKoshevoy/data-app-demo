import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ClipboardCopyIcon, ClipboardCheckIcon} from '@heroicons/react/outline'
import './address-copy.css';

type Props = {
  address: string,
  iconClasses?: string
}

const COPIED_STATE_TIMEOUT = 3000;

export const AddressCopy = ({address, iconClasses}: Props) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_STATE_TIMEOUT);
  }

  const iconClassName = iconClasses || 'h-4 w-4 relative -top-px';
  return (
    <CopyToClipboard text={address} onCopy={onCopy}>
     <div className="inline-flex items-center clickable">
       <div className="address-ellipsis">{address}</div>
       {copied ? <ClipboardCheckIcon className={iconClassName}/> : <ClipboardCopyIcon className={iconClassName}/>}
     </div>
    </CopyToClipboard>
  )
}
