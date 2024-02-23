import React, { useEffect, useState } from 'react';

import { Stats, Unclaimed } from '.';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

import Api from '../../api';

export function Dashboard(props) {
  const [apiError, setApiError] = useState(null);
  const [walletStats, setWalletStats] = useState([
    { stat: 'last7Days', label: 'Last 7 days', value: 0 },
    { stat: 'last30Days', label: 'Last 30 days', value: 0 },
  ]);
  const [unclaimed, setUnclaimed] = useState(0);

  useEffect(() => {
    const fetchWalletStats = async () => {
      try {
        const response = await Api.api().get(
          `/wallet/stats?walletAddress=${props.walletAddress}`
        );
        if (response && !response.error) {
          const stats = [
            {
              stat: 'last7Days',
              label: 'Last 7 days',
              value: response.last7Days,
            },
            {
              stat: 'last30Days',
              label: 'Last 30 days',
              value: response.last30Days,
            },
          ];
          setWalletStats(stats);
          setUnclaimed(response.unclaimed);
        }
      } catch (error) {
        console.error('error', error);
        setApiError(error); // Update state with API error
      }
    };

    fetchWalletStats();
  }, [props.walletAddress]);

  if (!props.walletAddress || props.isEditing) {
    return;
  }

  const formatWalletAddress = (address) => {
    if (address.length > 8) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <div className="xx-text-center xx-w-3/4">
      <div className="xx-mb-4 xx-text-xl">
        <div className="xx-mt-3 xx-text-lg">
          You're all set, now head over to{' '}
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            X
          </a>{' '}
          and let's go trolling!!
        </div>
        <div className="xx-rounded-lg xx-text-indigo-600 xx-bg-slate-100 xx-p-2 xx-mt-5 xx-mx-12  xx-cursor-pointer">
          <div
            className="xx-text-base xx-text-bold"
            onClick={props.handleEditClick}
          >
            <span className="xx-ml-4">
              {formatWalletAddress(props.walletAddress)}
            </span>
            <FontAwesomeIcon icon={faPenToSquare} className="xx-mr-4 xx-ml-2" />
          </div>
        </div>
        <Stats walletStats={walletStats} />
        <Unclaimed unclaimed={unclaimed} />
      </div>
    </div>
  );
}
