import {
    Box,
    Flex,
    Button,
    Stack,
    Image,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
} from "@chakra-ui/react";

export default function NavBar() {
    return (
        <Box>
            <Flex
                bg={useColorModeValue("white", "gray.800")}
                color={useColorModeValue("gray.600", "white")}
                minH={"60px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.200", "gray.900")}
                align={"center"}
            >
                <Flex align={"center"} flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                    <Image
                        borderRadius='full'
                        boxSize='40px'
                        src='logo.png'
                        fallbackSrc='fallBack.png'
                        mr={3}
                    />
                    <Link
                        p={3}
                        fontSize={'xl'}
                        href={'/'}
                        fontWeight={500}
                        color={'#EDB458'}
                        _hover={{
                            textDecoration: "none",
                            color: '#EDB458',
                        }}
                    >
                        Heapster

                    </Link>
                    <Flex display={{ base: "none", md: "flex" }} ml={10}>
                        <DesktopNav />
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={"flex-end"}
                    direction={"row"}
                    spacing={6}
                >
                    <Button
                        as={"a"}
                        href={"/login"}
                        variant={"link"}
                        fontSize={"sm"}
                        fontWeight={400}
                    >
                        Sign In
                    </Button>
                    <Button
                        as={"a"}
                        display={{ base: "none", md: "inline-flex" }}
                        fontSize={"sm"}
                        fontWeight={600}
                        color={"white"}
                        bg={"yellow.400"}
                        href={"/signup"}
                        _hover={{
                            bg: "yellow.600",
                        }}
                    >
                        Sign Up
                    </Button>
                </Stack>
            </Flex>
        </Box>
    );
}

const DesktopNav = () => {
    const linkColor = useColorModeValue("gray.600", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");

    return (
        <Stack align="center" direction={"row"} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? "#"}
                                fontSize={"sm"}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: "none",
                                    color: linkHoverColor,
                                }}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={"xl"}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={"xl"}
                                minW={"sm"}
                            >
                                <Stack></Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const NAV_ITEMS = [
    {
        label: "View Sets",
        href: "/sets",
    },
    {
        label: "Create Set",
        href: "/newset",
    },
    {
        label: "Search",
        href: "/search",
    },
    {
        label: "cyto",
        href: "cyto",
    }
];