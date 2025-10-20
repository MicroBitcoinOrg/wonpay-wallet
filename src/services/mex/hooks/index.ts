/**
 * MEX React Query Hooks
 *
 * Complete set of React Query hooks for all 30 MEX API endpoints.
 * Provides automatic caching, background refetching, and optimistic updates.
 *
 * @module mex/hooks
 *
 * @example Basic usage
 * ```tsx
 * import { useBalances, useOffers, useCreateTrade } from '@/services/mex/hooks';
 *
 * function TradingComponent() {
 *   const { data: balances } = useBalances(token);
 *   const { data: offers } = useOffers({ currency: 'MBC' });
 *   const createTrade = useCreateTrade(token);
 *
 *   const handleTrade = async (offerRef: string) => {
 *     await createTrade.mutateAsync({
 *       reference: offerRef,
 *       data: { amount: 50 }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       {offers?.list.map(offer => (
 *         <OfferCard key={offer.reference} offer={offer} onTrade={handleTrade} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

// Export types
export * from './types';
export {mexKeys} from './keys';

// Export authentication hooks
export {useAuthMessage, useLogin} from './useAuth';

// Export user hooks
export {useMyProfile, useUserProfile} from './useUser';

// Export finance hooks
export {useAddresses, useBalances, useHistory} from './useFinance';

// Export offers hooks
export {
    useOffers,
    useOffer,
    useOfferTrades,
    useCreateOffer,
    useUpdateOffer,
    useDeleteOffer,
} from './useOffers';

// Export trades hooks
export {
    useTrade,
    useOutgoingTrades,
    useIncomingTrades,
    useCreateTrade,
} from './useTrades';

// Export withdrawal hooks
export {useWithdrawals, useCreateWithdrawal} from './useWithdrawal';

// Export settings hooks
export {useUpdateUsername} from './useSettings';

// Export admin hooks
export {
    useAdminUsers,
    useAdminUser,
    useAdminUserBalances,
    useAdminTrades,
    useAdminTrade,
    useAdminHistory,
    useFlowStats,
    useBanUser,
    useUnbanUser,
    useCloseOffer,
} from './useAdmin';

// Re-export for namespaced access
export * as auth from './useAuth';
export * as user from './useUser';
export * as finance from './useFinance';
export * as offers from './useOffers';
export * as trades from './useTrades';
export * as withdrawal from './useWithdrawal';
export * as settings from './useSettings';
export * as admin from './useAdmin';
