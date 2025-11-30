// routing
import Routes from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { OtherAttachmentsProvider } from 'contexts/OtherAttachmentsContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => (
    <ThemeCustomization>
        {/* <RTLLayout> */}
        <Locales>
            <NavigationScroll>
                <AuthProvider>
                    <OtherAttachmentsProvider>
                        <>
                            <Notistack>
                                <Routes />
                                <Snackbar />
                            </Notistack>
                        </>
                    </OtherAttachmentsProvider>
                </AuthProvider>
            </NavigationScroll>
        </Locales>
        {/* </RTLLayout> */}
    </ThemeCustomization>
);

export default App;
