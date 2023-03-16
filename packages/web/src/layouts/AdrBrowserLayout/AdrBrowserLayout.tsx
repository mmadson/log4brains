import React from "react";
import {
  AppBar,
  // Divider,
  Drawer,
  List,
  // ListItem,
  // ListItemIcon,
  // ListItemText,
  Toolbar,
  Link as MuiLink,
  Typography,
  Backdrop,
  NoSsr,
  CircularProgress,
  Grow,
  Fade,
  Hidden,
  IconButton
} from "@material-ui/core";
import { Menu as MenuIcon, Close as CloseIcon } from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
// import {
//   ChevronRight as ChevronRightIcon,
//   PlaylistAddCheck as PlaylistAddCheckIcon
// } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AdrMenu } from "./components/AdrMenu";
import { CustomTheme } from "../../mui";
import { ConnectedSearchBox } from "./components/ConnectedSearchBox/ConnectedSearchBox";
import { AdrLight } from "../../types";
import { AdrNav, AdrNavContext } from "../../contexts";
import { RoutingProgress } from "./components/RoutingProgress";
import {FontWeightProperty} from "csstype";

const drawerWidth = 380;
const searchTransitionDuration = 300;

const useStyles = makeStyles((theme: CustomTheme) => {
  const topSpace = theme.spacing(6);
  return createStyles({
    root: {
      display: "flex"
    },
    layoutLeftCol: {
      flexGrow: 0.5,
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    layoutCenterCol: {
      paddingLeft: theme.custom.layout.centerColPadding,
      paddingRight: theme.custom.layout.centerColPadding,
      flexGrow: 1,
      [theme.breakpoints.up("md")]: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: theme.custom.layout.centerColBasis
      }
    },
    layoutRightCol: {
      flexGrow: 1,
      flexBasis: theme.custom.layout.rightColBasis,
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    appBarMenuButton: {
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    appBarTitle: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        alignItems: "center",
        width: drawerWidth - theme.spacing(3),
        flexGrow: 0,
        flexShrink: 0,
        cursor: "pointer"
      }
    },
    appBarTitleLink: {
      display: "block",
      color: "inherit",
      "&:hover": {
        color: "inherit"
      },
      marginLeft: theme.spacing(2)
    },
    searchBackdrop: {
      zIndex: theme.zIndex.modal - 2
    },
    searchBox: {
      zIndex: theme.zIndex.modal - 1,
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "70%"
      },
      transition: theme.transitions.create("width", {
        duration: searchTransitionDuration
      })
    },
    searchBoxOpen: {
      width: "100%"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        paddingTop: topSpace
      }
    },
    drawerToolbar: {
      visibility: "visible",
      [theme.breakpoints.up("sm")]: {
        visibility: "hidden"
      },
      justifyContent: "space-between"
    },
    adrMenu: {
      flexGrow: 1,
      flexShrink: 1,
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: 6,
        backgroundColor: theme.palette.background
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: 10,
        "-webkit-box-shadow": "inset 0 0 2px rgba(0,0,0,.3)",
        backgroundColor: theme.palette.grey[400]
      }
    },
    bottomMenuList: {
      flexGrow: 0,
      flexShrink: 0
    },
    adlTitleAndSpinner: {
      display: "flex",
      justifyContent: "space-between",
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3)
      },
      paddingBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(3)
    },
    adlTitle: {
      fontWeight: theme.typography.fontWeightBold as FontWeightProperty
    },
    adrMenuSpinner: {
      alignSelf: "center",
      marginTop: "30vh"
    },
    container: {
      flexGrow: 1,
      paddingTop: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingTop: topSpace
      }
    },
    content: {
      minHeight: `calc(100vh - 35px - ${
        theme.spacing(1) + theme.spacing(8)
      }px)`, // TODO: calc AppBar height more precisely
      [theme.breakpoints.up("sm")]: {
        minHeight: `calc(100vh - 35px - ${topSpace + theme.spacing(8)}px)` // TODO: calc AppBar height more precisely
      }
    },
    footer: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[500],
      height: 35,
      display: "flex",
      marginTop: theme.spacing(6)
    },
    footerText: {
      fontSize: "0.77rem"
    },
    footerLink: {
      color: theme.palette.grey[600],
      fontSize: "0.8rem",
      "&:hover": {
        color: theme.palette.grey[800]
      }
    },
    footerContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  });
});

function buildAdrNav(currentAdr: AdrLight, adrs: AdrLight[]): AdrNav {
  const currentIndex = adrs
    .map((adr, index) => (adr.slug === currentAdr.slug ? index : undefined))
    .filter((adr) => adr !== undefined)
    .pop();
  const previousAdr =
    currentIndex !== undefined && currentIndex < adrs.length - 1
      ? adrs[currentIndex + 1]
      : undefined;
  const nextAdr =
    currentIndex !== undefined && currentIndex > 0
      ? adrs[currentIndex - 1]
      : undefined;
  return {
    previousAdr,
    nextAdr
  };
}

export type AdrBrowserLayoutProps = {
  projectName: string;
  createAdrLink: string;
  adrs?: AdrLight[]; // undefined -> loading, empty -> empty
  adrsReloading?: boolean;
  currentAdr?: AdrLight;
  children: React.ReactNode;
  routing?: boolean;
  l4bVersion: string;
  repositoryUrl: string;
};

export function AdrBrowserLayout({
  projectName,
  adrs,
  createAdrLink,
  adrsReloading = false,
  currentAdr,
  children,
  routing = false,
  l4bVersion,
  repositoryUrl
}: AdrBrowserLayoutProps) {
  const classes = useStyles();
  const router = useRouter();

  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  React.useEffect(() => {
    const closeMobileDrawer = () => setMobileDrawerOpen(false);
    router?.events.on("routeChangeStart", closeMobileDrawer);
    return () => {
      router?.events.off("routeChangeStart", closeMobileDrawer);
    };
  }, [router]);

  const [searchOpen, setSearchOpenState] = React.useState(false);
  const [searchReallyOpen, setSearchReallyOpenState] = React.useState(false);

  const drawer = (
    <div className={classes.drawerContainer}>
      <Toolbar className={classes.drawerToolbar}>
        <div />
        <Link href="/" passHref>
          <IconButton
            size="small"
            color="inherit"
            aria-label="go to homepage"
            title={`Architecture knowledge base of ${projectName}`}
          >
            <img
              src={`${router?.basePath}/l4b-static/Log4brains-logo.png`}
              alt="Log4brains logo"
              width={40}
              height={40}
            />
          </IconButton>
        </Link>
        <IconButton
          size="small"
          color="inherit"
          aria-label="close drawer"
          title="Close"
          onClick={handleMobileDrawerToggle}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Toolbar>

      <div className={classes.adlTitleAndSpinner}>
        <Typography variant="subtitle2" className={classes.adlTitle}>
          Decision log
        </Typography>

        <Fade in={adrsReloading}>
          <CircularProgress size={13} />
        </Fade>
      </div>

      <Grow in={adrs !== undefined} style={{ transformOrigin: "center left" }}>
        <AdrMenu
          adrs={adrs}
          createAdrLink={createAdrLink}
          currentAdrSlug={currentAdr?.slug}
          className={classes.adrMenu}
        />
      </Grow>

      {adrs === undefined && (
        <CircularProgress size={30} className={classes.adrMenuSpinner} />
      )}

      <List className={classes.bottomMenuList}>
        {/* <Divider />
      <ListItem button>
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>
        <ListItemText>
          <Badge badgeContent={0} color="primary">
            <Typography>Filters</Typography>
          </Badge>
        </ListItemText>
      </ListItem> */}
        {/* <Divider />
      <Link href="/decision-backlog" passHref>
        <ListItem button selected={backlog} component="a">
          <ListItemIcon>
            <PlaylistAddCheckIcon />
          </ListItemIcon>
          <ListItemText primary="Decision backlog" />
        </ListItem>
      </Link> */}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        {routing && <RoutingProgress />}
        <Toolbar>
          <a target="_blank" rel="noreferrer" href={repositoryUrl} aria-label="View source in GitLab"
             title="View source in GitLab" style={{zIndex: 99999}}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 style={{fill: "#fff", color: "#24292e", position: "absolute", top: 0, right: 0}} viewBox="0 0 250 250"
                 fill="#151513" height="68" width="68">
              <path fill="#fff"
                    d="M 249.57771,250.29409 C 163.6834,162.06673 87.406263,88.122635 -0.4222853,0.29408743 H 249.57771 Z"/>
              <path fill="currentColor"
                    d="m 194.57892,71.296301 c -2,-4 -5.00268,-7.999511 -9.00269,-11.999515 -3.99999,-3.999997 -7.9995,-7.002681 -11.9995,-9.002681 -4.00001,-14.000002 -8.99659,-16.998292 -8.99659,-16.998292 -8,3.999999 -11.00464,8.998533 -11.00462,10.998545 -6.00001,0 -10.99732,2.000735 -15.99732,7.000731 -16,16.000004 -10.00195,29.997316 -2.00195,40.997318 -3,0 -6.99854,0.998782 -10.99855,4.998771 L 113.57917,109.2968 c -2,1 -5.99975,-1.00097 -5.99975,-1.00097 l 26.99584,26.99584 c 0,0 -1.99999,-3.99877 0,-4.99877 l 14.00147,-14.00147 c 2.00001,-3 3.00294,-5.9956 3.00293,-7.9956 11,8 23.99732,14.99804 40.99732,-2.00195 5,-5.00001 7.00073,-9.997326 7.00073,-15.997325 -0.90398,-9.744341 -2.80609,-14.23012 -4.99878,-19.000243 z"></path>
              <path fill="currentColor"
                    d="m 121.28633,101.84712 c -14.99999,-9.000009 -8.99999,-19.00001 -8.99999,-19.00001 2.99999,-6.999997 1.99999,-10.999997 1.99999,-10.999997 -1,-7.000002 3,-1.999998 3,-1.999998 4.00001,4.999996 2,11 2,11 -2.99999,9.999998 5.00001,14.999998 9,15.999996"
                    style={{transformOrigin: "130px 106px"}}/>
              <path fill="currentColor"
                    d="m 210.61601,77.354548 c 0,0 -2.99732,-5.000738 -15.99732,-7.000737 -0.0144,-0.02843 0.007,0.01428 0,0 -0.007,-0.01428 -3.99055,0.468874 -3.99055,0.468874 l 5.4469,19.797551 3.57294,-1.284473 c 2.01561,-1.004006 6.98378,-3.016688 10.96801,-11.981199 z"
                    style={{transformOrigin: "180px 90px"}}/>
            </svg>
          </a>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            className={classes.appBarMenuButton}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <div className={classes.appBarTitle}>
              <div>
                <img
                  src={`${router?.basePath}/l4b-static/Log4brains-logo-dark.png`}
                  alt="Log4brains logo"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <Link href="/" passHref>
                  <MuiLink
                    variant="h6"
                    noWrap
                    className={classes.appBarTitleLink}
                  >
                    {projectName}
                  </MuiLink>
                </Link>
                <Link href="/" passHref>
                  <MuiLink
                    variant="body2"
                    noWrap
                    className={classes.appBarTitleLink}
                  >
                    Architecture knowledge base
                  </MuiLink>
                </Link>
              </div>
            </div>
          </Link>
          <div className={classes.layoutLeftCol} />
          <div className={clsx(classes.layoutCenterCol)}>
            <Backdrop open={searchOpen} className={classes.searchBackdrop} />
            <NoSsr>
              <ConnectedSearchBox
                onOpen={() => {
                  setSearchOpenState(true);
                  // Delayed real opening because otherwise the dropdown width is bugged
                  setTimeout(
                    () => setSearchReallyOpenState(true),
                    searchTransitionDuration + 100
                  );
                }}
                onClose={() => {
                  setSearchOpenState(false);
                  setSearchReallyOpenState(false);
                }}
                open={searchReallyOpen}
                className={clsx(classes.searchBox, {
                  [classes.searchBoxOpen]: searchOpen
                })}
              />
            </NoSsr>
          </div>
          <div className={classes.layoutRightCol} />
        </Toolbar>
      </AppBar>

      <nav
        className={classes.drawer}
        aria-label="architecture decision records list"
      >
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileDrawerOpen}
            onClose={handleMobileDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <div className={classes.container}>
        <Toolbar />
        <main className={classes.content}>
          <AdrNavContext.Provider
            value={currentAdr && adrs ? buildAdrNav(currentAdr, adrs) : {}}
          >
            {children}
          </AdrNavContext.Provider>
        </main>
        <footer className={classes.footer}>
          <div className={classes.layoutLeftCol} />
          <div className={clsx(classes.layoutCenterCol, classes.footerContent)}>
            <Typography className={classes.footerText}>
              Powered by{" "}
              <MuiLink
                href="https://github.com/thomvaill/log4brains"
                className={classes.footerLink}
                target="_blank"
                rel="noopener"
              >
                Log4brains
              </MuiLink>{" "}
              <span style={{ fontSize: "0.8em" }}>
                {l4bVersion ? `(v${l4bVersion})` : null}
              </span>
            </Typography>
          </div>
          <div className={classes.layoutRightCol} />
        </footer>
      </div>
    </div>
  );
}
