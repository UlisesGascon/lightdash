import { ApiError, ApiHealthResults, HealthState } from '@lightdash/common';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { lightdashApi } from '../../api';
import useToaster from '../toaster/useToaster';

const getHealthState = async () =>
    lightdashApi<ApiHealthResults>({
        url: `/health`,
        method: 'GET',
        body: undefined,
    });

const useHealth = () => {
    const health = useQuery<HealthState, ApiError>({
        queryKey: 'health',
        queryFn: getHealthState,
    });

    const { showToastError } = useToaster();

    useEffect(() => {
        if (health.error) {
            const [first, ...rest] = health.error.error.message.split('\n');
            showToastError({
                key: first,
                subtitle: (
                    <div>
                        <b>{first}</b>
                        <p>{rest.join('\n')}</p>
                    </div>
                ),
                autoClose: false,
            });
        }
    }, [health, showToastError]);

    return health;
};

export default useHealth;
