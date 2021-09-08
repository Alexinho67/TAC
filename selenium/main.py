
from random import random
from random import seed
import time
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import Select
from random import seed
from random import random

# seed random number generator
seed(1)


def loginPage(driver):
    inputEmail = driver.find_element_by_name('username')
    inputPw = driver.find_element_by_name('password')
    inputEmail.send_keys(MAIL)
    inputPw.send_keys(PW)
    spanElements = driver.find_elements_by_tag_name('span')
    # print('spans: ', spanElements)
    for span in spanElements:
        if (span.text == 'LOGIN'):
            btnLogin = span.find_element_by_xpath('./..')
            break
    print(btnLogin)
    btnLogin.click()
    
def enter_first_lecture_of_course(driver, scrollDown=True):
    
    if (scrollDown == True):
        containerScroll = driver.find_element_by_class_name("jss77")
        driver.execute_script(
            "arguments[0].scrollTo(0,arguments[1]);", containerScroll, 1000)


    headingFirstChapter = driver.find_element_by_xpath(
        f"//h3[contains(text(),'{NAME_FIRST_CHAPTER}')]")

    firstMainUnit = headingFirstChapter.find_element_by_xpath('./../../..')

    time.sleep(1)

    list_ul_elements = firstMainUnit.find_elements_by_tag_name('ul')
    if (len(list_ul_elements) == 0):
        print('Need to expand ', NAME_FIRST_CHAPTER)
        # first main unit is currently collapsed. Expand it by clicking on the first link
        # driver.execute_script("arguments[0].click();", firstMainUnit)
        # firstMainUnit.click()
        ActionChains(driver).move_to_element(firstMainUnit).click().perform()


    time.sleep(1)

    # findFirstLecture = driver.find_element_by_xpath(f"//ul[@class='{CLASS_SUB_UNITS_ULIST}']/li[1]/div/a")
    findFirstLecture = firstMainUnit.find_element_by_link_text(NAME_FIRST_UNIT)
    time.sleep(1)
    driver.execute_script("arguments[0].click();", findFirstLecture)
    # findFirstLecture.click()

    time.sleep(1)

def loop_through_all_units(driver):
    continueLearning = True
    while continueLearning == True:
        currentUrl = driver.current_url
        print('    Currently on url:', currentUrl)

        # unit pages have current url pattern: https://portal.bitacademy.at/module/366/phase/7198/
        if ('phase' not in currentUrl):
            # back on the main page
            print('Reached main page: ', currentUrl)
            continueLearning = False
            break
        time.sleep(2)
        # thema = driver.find_element_by_xpath("//h1 | //h2").text
        # print('    Topic: ', thema)
        # driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")

        scrollDown = False
        if (scrollDown == True):
            print('Scrolling down')
            containerScroll = driver.find_element_by_class_name("jss579")
            h = int(containerScroll.get_attribute('scrollHeight'))
            driver.execute_script(
                "arguments[0].scrollTo(0,arguments[1]);", containerScroll, h)

        list_matches = driver.find_elements_by_xpath("//span[contains(text(), 'Weiter')]")
        if (len(list_matches)==0):
            print("Couldn't find 'Weiter'. Looking for 'Überspringen' now.")
            list_matches = driver.find_elements_by_xpath("//span[contains(text(), 'Überspringen')]")
        btnNext = list_matches[-1]
        
        learn_time = max(5, TIME_PER_PAGE + (random()-0.5)*15)
        # print('Sleeping ', learn_time,' seconds.')
        time.sleep(learn_time)
        # print('Clicking  button with text: ', btnNext.text)
        # ActionChains(driver).click(btnNext).perform()
        driver.execute_script("arguments[0].click();", btnNext)
        # btnNext.click()
        # actions = ActionChains(driver)
        # # actions.move_to_element(btnNext)
        # actions.click(btnNext)
        # actions.perform()

        time.sleep(1)


def createNewGame(driver, name):
    global idGame

    actions = ActionChains(driver)
    driver.get(url_0)

    inputUserName = driver.find_element_by_id('userName')
    inputUserName.clear()
    inputUserName.send_keys(name)

    selectNrPlayer = Select(driver.find_element_by_id('nrPlayer'))
    selectNrPlayer.select_by_index(0)

    selectColor = Select(driver.find_element_by_id('colorPlayer'))
    selectColor.select_by_index(0)
    

    btnCreate = driver.find_element_by_id('btnCreateGame')
    print(f'Clicking button with text: {btnCreate.text}')
    btnCreate.click()
    idGame = driver.find_element_by_id('gameId').text
    print(f'game created. ID {idGame} ')
    print('end')

def joinGame(driver,idxPlayer,idxColor, name):
    global idGame
    print(f"Joining game {idGame} as player {name}#{idxPlayer}")
    driver.get(url_0)
    time.sleep(1)

    selectNrPlayer = Select(driver.find_element_by_id('nrPlayer'))
    selectColor = Select(driver.find_element_by_id('colorPlayer'))
    inputUserName = driver.find_element_by_id('userName')
    btnJoinGame = driver.find_element_by_id('btnJoinGame')
    fieldIdGame = driver.find_element_by_id('inputGameId')

    # send idGame as first, because otherwise it would overwride 
    # the player Number selection (keys: 1,2,3 or 4)
    fieldIdGame.send_keys(idGame)

    selectNrPlayer.select_by_index(idxPlayer)
    selectColor.select_by_index(idxColor)
    inputUserName.clear()
    inputUserName.send_keys(name)
    
    btnJoinGame.click()
    
def clickReady(driver):
    time.sleep(1)
    driver.find_element_by_id('btnReady').click()
# -----------------------  main  -----------------------

chrome_options = webdriver.ChromeOptions()
print(chrome_options.experimental_options)
url_0 = 'http://localhost:3000'

chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
# chrome_options.add_experimental_option("excludeSwitches", ['enable-automation'])

PATH_CHROME = "C:\\Users\\alexinho\\Downloads\\chromedriver_win32\\chromedriver.exe"
WIDTH = 700
HEIGHT = 830
OFFSET = 40

try:
    driverCreateGame = webdriver.Chrome(executable_path=PATH_CHROME, options=chrome_options)
    driverCreateGame.implicitly_wait(20)
    time.sleep(1)
    driverCreateGame.set_window_position(0, 0)
    driverCreateGame.set_window_size(WIDTH, HEIGHT)

    listDriversJoin = [None, None, None]
    NUM_PLAYER_JOIN = 3
    for  i in range(0,NUM_PLAYER_JOIN):  
        listDriversJoin[i] = webdriver.Chrome(
            executable_path=PATH_CHROME, options=chrome_options)
        listDriversJoin[i] .implicitly_wait(20)
        listDriversJoin[i] .set_window_position(WIDTH + 120 - i*OFFSET, i*OFFSET)
        listDriversJoin[i] .set_window_size(WIDTH, HEIGHT - i*OFFSET)

        


    # driverJoinGame = webdriver.Chrome(executable_path=PATH_CHROME, options=chrome_options)
    # driverJoinGame.implicitly_wait(20)
    # driverJoinGame.set_window_position(WIDTH, 0)
    # driverJoinGame.set_window_size(WIDTH, HEIGHT)
    
    createNewGame(driverCreateGame,'Ax')
    names = ['Bx','Cx','Dx']
    for j in range(0, len(listDriversJoin)):
        time.sleep(1)
        joinGame(listDriversJoin[j], j+1, j+1, names[j])

    allDrivers = listDriversJoin
    allDrivers.insert(0, driverCreateGame)

    ans = input('Send ready (y/n)?')
    print(f'User send "{ans}"')

    if (ans =='y'):
        for i in range(0, 4):
            clickReady(allDrivers[i])

finally:
    pass
    driverCreateGame.quit()
    for j in range(0, len(listDriversJoin)):
        listDriversJoin[j].quit()




