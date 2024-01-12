using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace SetDown
{
    public partial class MainWindow : Window
    {
        private readonly ModalWindow AlertWindow;
        private readonly ComplexCounter Counter;
        private readonly List<string> RadioButtons = new() { "RadioButton0", "RadioButton1", "RadioButton2", "RadioButton3", "RadioButton4", "RadioButton5" };
        private readonly List<int> TimeoutList = new() { 1800, 3600, 5400, 7200, 9000, 10800 };

        private Thread CountDown;

        private int countSelected;

        private int DisplaySelected = 0;
        private int DisplayCount = 1;


        public MainWindow()
        {
            InitializeComponent();

            AlertWindow = new ModalWindow { Topmost = true };

            AlertWindow.ButtonClicked += Check_Modal;

            Counter = new ComplexCounter(countSelected, AlertWindow, this);

            CountDown = new Thread(ThreadCounter);

            UpdateTimeouts(sender: null, @event: null);
        }

        private void UpdateTimeouts(object? sender, EventArgs? @event)
        {
            StreamReader file;

            try { file = new("timeouts.conf"); }
            catch (Exception) { return; }


            for (int i = 0; i < RadioButtons.Count; i++)
            {
                int timeout = GetTimeout(file);

                TimeoutList[i] = timeout;

                ConfigureRadioButton(RadioButtons[i], timeout);
            }
        }

        private static int GetTimeout(StreamReader file)
        {
            String? line = file.ReadLine();

            if (line == null) return 0;

            return int.Parse(line);
        }

        private void ConfigureRadioButton(string radiobuttonName, int timeout)
        {
            Counter count = new(timeout);
            RadioButton radiobutton = System.Windows.Application.Current.Dispatcher.Invoke(() => (RadioButton)this.FindName(radiobuttonName));
            TextBlock textblock = System.Windows.Application.Current.Dispatcher.Invoke(() => (TextBlock)radiobutton.Content);
            System.Windows.Application.Current.Dispatcher.Invoke(() => textblock.Text = count.ToString());
        }



        private void DragWindow(object sender, MouseButtonEventArgs e)
        {
            if (System.Windows.Application.Current.Dispatcher.Invoke(() => e.ChangedButton == MouseButton.Left)) this.DragMove();
        }

        private void CloseApplication(object sender, RoutedEventArgs e)
        {
            System.Windows.Application.Current.Shutdown();
        }

        private void MinimizeWindow(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void SetConfig(object sender, RoutedEventArgs e)
        {
            MainPage.Visibility = Visibility.Hidden;
            Process updating = Process.Start("notepad.exe", "timeouts.conf");
            updating.EnableRaisingEvents = true;
            updating.Exited += new EventHandler(UpdateTimeouts);
        }

        public void ThreadCounter()
        {
            try
            {
                while (true)
                {
                    Thread.Sleep(999);
                    UpdateCounter(Counter.Next());
                }
            }
            catch (ThreadInterruptedException) { }
        }

        private void UpdateCounter(String count)
        {
            if (graphCounter.Dispatcher.CheckAccess()) graphCounter.Content = count;
            else graphCounter.Dispatcher.BeginInvoke(new Action<String>(UpdateCounter), count);
        }

        private void InterruptCounter()
        {
            try { CountDown.Interrupt(); }
            catch (Exception) { }

            Counter.Cancel();
            Privilege(() => this.owl.Visibility = Visibility.Hidden);
            Privilege(() => this.clock.Visibility = Visibility.Visible);
        }

        private void CancelTimeout(Object sender, RoutedEventArgs e)
        {
            InterruptCounter();

            UpdateCounter(Counter.ToString());

            countSelected = 0;

            UnselectRadioButtons();

            BorderCounter.Visibility = Visibility.Hidden;
        }

        private void AcceptTimeout(Object sender, RoutedEventArgs e)
        {
            if (countSelected == 0) return;

            InterruptCounter();

            Counter.SetCounter(countSelected);

            CountDown = new Thread(ThreadCounter);

            CountDown.Start();

            BorderCounter.Visibility = Visibility.Hidden;

            if (countSelected <= 600) Privilege(() => AlertWindow.Show());
        }

        private void SetTimer(object sender, RoutedEventArgs e)
        {
            if (sender is not System.Windows.Controls.RadioButton radioButton) return;

            switch (radioButton.Name)
            {
                case "RadioButton0":
                    countSelected = TimeoutList[0];
                    break;

                case "RadioButton1":
                    countSelected = TimeoutList[1];
                    break;

                case "RadioButton2":
                    countSelected = TimeoutList[2];
                    break;

                case "RadioButton3":
                    countSelected = TimeoutList[3];
                    break;

                case "RadioButton4":
                    countSelected = TimeoutList[4];
                    break;

                case "RadioButton5":
                    countSelected = TimeoutList[5];
                    break;
            }

            if (CountDown.IsAlive) return;

            Counter.SetCounter(countSelected);

            UpdateCounter(Counter.ToString());
        }

        private void Check_Modal(object? sender, EventArgs e)
        {
            InterruptCounter();

            UpdateCounter(Counter.ToString());

            this.Focus();
        }

        private void UnselectRadioButtons()
        {
            RadioButtons.ForEach(button => Uncheck(button));
        }

        private void Uncheck(string button)
        {
            System.Windows.Controls.RadioButton? radioButton = (System.Windows.Controls.RadioButton)FindName(button);
            radioButton.IsChecked = false;
        }

        private void ControlButton_Checked(object sender, RoutedEventArgs e)
        {
            if (CountDown.IsAlive) return;

            if (sender is not Button Button) return;

            if (BorderCounter.Visibility == Visibility.Hidden)
            {
                DisplaySelected = 0;
                UpdateDisplay();
                BorderCounter.Visibility = Visibility.Visible;
                return;
            }

            switch (Button.Name)
            {
                case "Up":
                    countSelected += DisplayCount;
                    Counter.SetCounter(countSelected);
                    UpdateCounter(Counter.ToString());
                    break;
                case "Down":
                    if (countSelected <= 0) return;
                    countSelected -= DisplayCount;
                    Counter.SetCounter(countSelected);
                    UpdateCounter(Counter.ToString());
                    break;
                case "Left":
                    DisplaySelected++;
                    DisplaySelected = DisplaySelected % 3;
                    UpdateDisplay();
                    break;
                case "Right":
                    DisplaySelected--;
                    if (DisplaySelected == -1) DisplaySelected = 2;
                    UpdateDisplay();
                    break;
            }
        }

        private void UpdateDisplay()
        {
            switch (DisplaySelected)
            {
                case 0: //right
                    DisplayCount = 1;
                    BorderCounter.Margin = new Thickness(225, 65, 0, 0);
                    break;

                case 1: //mid
                    DisplayCount = 60;
                    BorderCounter.Margin = new Thickness(-5, 65, 0, 0);
                    break;

                case 2: //left
                    DisplayCount = 3600;
                    BorderCounter.Margin = new Thickness(-235, 65, 0, 0);
                    break;
            }
        }

        public static void Privilege(Action accion)
        {
            System.Windows.Application.Current.Dispatcher.Invoke(accion);
        }
    }
}
