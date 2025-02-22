// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import OwnedCoinView from './components/OwnedCoinView';

import type { CoinBalance } from '@mysten/sui.js';

import { useGetAllBalances } from '~/hooks/useGetAllBalances';
import { Heading } from '~/ui/Heading';
import { LoadingSpinner } from '~/ui/LoadingSpinner';
import { Pagination } from '~/ui/Pagination';
import { Text } from '~/ui/Text';

export const COINS_PER_PAGE: number = 6;

function OwnedCoins({ id }: { id: string }): JSX.Element {
    const [uniqueCoins, setUniqueCoins] = useState<CoinBalance[]>([]);
    const [currentSlice, setCurrentSlice] = useState(1);
    const { isLoading, data, isError } = useGetAllBalances(id);

    useEffect(() => {
        if (data) {
            setUniqueCoins(data);
        }
    }, [data]);

    if (isError) {
        return (
            <div className="pt-2 font-sans font-semibold text-issue-dark">
                Failed to load Coins
            </div>
        );
    }

    return (
        <div className="pl-7.5">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex flex-col space-y-5 pt-5 text-left xl:pr-10">
                    <Heading color="gray-90" variant="heading4/semibold">
                        Coins
                    </Heading>
                    <div className="flex max-h-80 flex-col overflow-auto">
                        <div className="grid grid-cols-3 py-2 uppercase tracking-wider text-gray-80">
                            <Text variant="caption/medium">Type</Text>
                            <Text variant="caption/medium">Objects</Text>
                            <Text variant="caption/medium">Balance</Text>
                        </div>
                        <div>
                            {uniqueCoins
                                .slice(
                                    (currentSlice - 1) * COINS_PER_PAGE,
                                    currentSlice * COINS_PER_PAGE
                                )
                                .map((coin) => (
                                    <OwnedCoinView
                                        id={id}
                                        key={coin.coinType}
                                        coin={coin}
                                    />
                                ))}
                        </div>
                    </div>
                    {uniqueCoins.length > COINS_PER_PAGE && (
                        <Pagination
                            onNext={() => setCurrentSlice(currentSlice + 1)}
                            hasNext={
                                currentSlice !==
                                Math.ceil(uniqueCoins.length / COINS_PER_PAGE)
                            }
                            hasPrev={currentSlice !== 1}
                            onPrev={() => setCurrentSlice(currentSlice - 1)}
                            onFirst={() => setCurrentSlice(1)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default OwnedCoins;
